import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import axios from 'axios';
// @mui
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import { ThreeDots } from 'react-loader-spinner'
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead } from '../sections/@dashboard/user';
// mock


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'tc_id', label: 'T.C Kimlik No.', alignRight: false },
  { id: 'name', label: 'İsim', alignRight: false },
  { id: 'type', label: 'Alan', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------


export default function ClientsPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([])
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);


  const getClients = async () => {
    const user = JSON.parse(localStorage.getItem('user'))
    setLoading(true)
    const clients = await axios.get (`clients?filters[$and][0][therapist][id]=${user.id}&filters[$and][1][active][$ne]=false&populate=*&pagination[page]=${page+1}&pagination[pageSize]=${rowsPerPage}&sort[0]=birth_date`)
    setLoading(false)
    setCount(clients.meta.pagination.total)

    setRows (clients.data.map (client => ({...client.attributes, id: client.id})))
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };


  useEffect(() => {
    getClients()
    // eslint-disable-next-line
  }, [rowsPerPage, page])

  return (
    <>
      <Helmet>
        <title> Danışanlarım | Kartela Psikoloji </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danışanlarım
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
                      const { id, tc_id: tcId, name, type } = row;

                      return (
                        <TableRow hover key={id} tabIndex={-1} role="checkbox">
                          <TableCell padding="checkbox">
                            {/* <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} /> */}
                          </TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              {/* <Avatar alt={name} src={avatarUrl} /> */}
                              <Typography variant="subtitle2" noWrap>
                                {tcId}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{name}</TableCell>

                          <TableCell align="left">
                            {type}
                          </TableCell>
                          <TableCell align="left"/>
                        </TableRow>
                      );
                    })}
                  </TableBody>}
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
    </>
  );
}
