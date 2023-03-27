import PropTypes from 'prop-types';
// @mui
import { TableRow, TableCell, TableHead,} from '@mui/material';

// ----------------------------------------------------------------------

UserListHead.propTypes = {
  headLabel: PropTypes.array,
};

export default function UserListHead({
  headLabel,
}) {

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {/* <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          /> */}
        </TableCell>
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? 'right' : 'left'}
          >
            {headCell.label}
            {/* <TableSortLabel
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
              ) : null}
            </TableSortLabel> */}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
