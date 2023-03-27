import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Popover,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import { ThreeDots } from 'react-loader-spinner'
import { FaCheck, FaTimes } from "react-icons/fa"
import { millisToMinutesAndSeconds } from '../utils/formatTime';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead } from '../sections/@dashboard/user';
// mock


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'İsim', alignRight: false },
  { id: 'gender', label: 'Cinsiyet', alignRight: false },
  { id: 'session_type', label: 'Kategori', alignRight: false },
  { id: 'room', label: 'Oda', alignRight: false },
  { id: 'start_date', label: 'Başlangıç', alignRight: false },
  { id: 'duration', label: 'Süre', alignRight: false },
  { id: 'price', label: 'Ücret (₺)', alignRight: false },
  { id: 'is_paid', label: 'Ödendi mi?', alignRight: false },
  { id: 'is_completed', label: 'Tamamlandı mı?', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function SessionsPage() {
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [clients, setClients] = useState ([])
  const [sessionTypes, setSessionTypes] = useState ([])
  const [rows, setRows] = useState ([])
  const [rooms, setRooms] = useState ([])
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const boolSelect = [
    {value: true, label: 'Evet'},
    {value: false, label: 'Hayır'},
    {value: 0, label: 'Boş'},
  ]
  const [filterData, setFilterData] = useState ({
    client: undefined,
    room: undefined,
    is_paid: undefined,
    is_completed: undefined,
    session_type: undefined,
  })

  const getSessions = async () => {
    const user = JSON.parse(localStorage.getItem('user'))
    let queryString = `sessions?populate=*&pagination[page]=${page+1}&pagination[pageSize]=${rowsPerPage}&sort[0]=start_time%3Adesc&filters[$and][0][client][therapist][id]=${user.id}`
    let and = 1
    if (filterData.client > 0) {
      queryString = `${queryString}&filters[$and][${and}][client][id]=${filterData.client}`
      and += 1
    }
    if (filterData.room > 0) {
      queryString = `${queryString}&filters[$and][${and}][room][id]=${filterData.room}`
      and += 1
    }
    if (filterData.session_type > 0) {
      queryString = `${queryString}&filters[$and][${and}][session_type][id]=${filterData.session_type}`
      and += 1
    }
    if (filterData.is_paid !== undefined && Number (filterData.is_paid) !== -1) {
      queryString = `${queryString}&filters[$and][${and}][is_paid]${Number (filterData.is_paid) !== 0 ? `=${filterData.is_paid}`: `[$null]=true`}`
      and += 1
    }
    if (filterData.is_completed !== undefined && Number (filterData.is_completed) !== -1 ) {
      queryString = `${queryString}&filters[$and][${and}][is_completed]${Number (filterData.is_completed) !== 0 ? `=${filterData.is_completed}`: `[$null]=true`}`
      and += 1
    }

    setLoading (true)
    const sessions = await axios.get (queryString)
    const clients = await axios.get (`clients?filters[$and][0][therapist][id]=${user.id}&filters[$and][1][active][$ne]=false&populate=*`)
    const rooms = await axios.get ('rooms')
    const sessionTypes = await axios.get ('session-types?filters[is_for_event]=false')

    setLoading (false)
    setCount (sessions.meta.pagination.total)

    setClients (clients.data)
    setRooms (rooms.data)
    setSessionTypes (sessionTypes.data)

    setRows(sessions.data.map ((session) => {
      const sessionData = session.attributes
      const startTime = new Date (sessionData.start_time).getTime ()
      const endTime = new Date (sessionData.end_time).getTime ()
      const duration = millisToMinutesAndSeconds(endTime - startTime)

      return (
        {
          startDate: moment(startTime).format('MMMM Do YYYY, HH:mm:ss'),
          duration,
          price: sessionData.price,
          isPaid: sessionData.is_paid === true ? <FaCheck color="#50C878"/> : sessionData.is_paid === false ? <FaTimes color="#f44336"/> : null,
          isCompleted: sessionData.is_completed === true ? <FaCheck color="#50C878"/> : sessionData.is_completed === false ? <FaTimes color="#f44336"/> : null,
          name: sessionData.client.data.attributes.name,
          gender: sessionData.client.data.attributes.gender,
          room: sessionData.room.data.attributes.name,
          id: session.id,
          sessionType: sessionData.session_type?.data?.attributes?.name
        }
      )
      }))
  }

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const filteredData = applySortFilter(rows, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredData.length && !!filterName;

  useEffect (() => {
    getSessions ()
  },[filterData, rowsPerPage, page])

  return (
    <>
      <Helmet>
        <title> Seans Listesi | Kartela Psikoloji </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Seans Listesi
          </Typography>
        </Stack>

        <Card>
          {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table width='100%'>
                <UserListHead
                  headLabel={TABLE_HEAD}
                  rowCount={count}
                />
                {loading ?
                <Stack direction="row" alignItems="center" justifyContent="center" width='100%'>
                <ThreeDots
                  height="80"
                  width="80"
                  radius="9"
                  color="#4fa94d"
                  ariaLabel="three-dots-loading"
                  wrapperClassName="three-dots"
                  visible
                />
              </Stack>
                :
                <TableBody>
                  {rows.map((row) => {
                    const { startDate, duration, price, isPaid, isCompleted, name, gender,room, id, sessionType } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>

                        <TableCell padding="checkbox">
                          {/* <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} /> */}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{gender}</TableCell>

                        <TableCell align="left">{sessionType ?? '-'}</TableCell>

                        <TableCell align="left">{room}</TableCell>

                        <TableCell align="left">
                          {startDate}
                        </TableCell>

                        <TableCell align="left">
                          {duration}
                        </TableCell>

                        <TableCell align="left">
                          {price}
                        </TableCell>

                        <TableCell align="left">
                          {isPaid}
                        </TableCell>

                        <TableCell align="left">
                          {isCompleted}
                        </TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>}

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Bulunamadı
                          </Typography>

                          <Typography variant="body2">
                            Sonuç Bulunamadı &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Kontrol edin.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Düzenle
        </MenuItem>
      </Popover>
    </>
  );
}
