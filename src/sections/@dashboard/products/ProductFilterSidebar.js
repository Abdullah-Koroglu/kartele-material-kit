import { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  Rating,
  Divider,
  Select,
  FormGroup,
  IconButton,
  Typography,
  RadioGroup,
  FormControlLabel,
  MenuItem,
} from '@mui/material';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { ColorMultiPicker } from '../../../components/color-utils';

// ----------------------------------------------------------------------

export const SORT_BY_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'priceAsc', label: 'Price: Low-High' },
];
export const FILTER_GENDER_OPTIONS = ['Men', 'Women', 'Kids'];
export const FILTER_CATEGORY_OPTIONS = ['All', 'Shose', 'Apparel', 'Accessories'];
export const FILTER_RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];
export const FILTER_PRICE_OPTIONS = [
  { value: 'below', label: 'Below $25' },
  { value: 'between', label: 'Between $25 - $75' },
  { value: 'above', label: 'Above $75' },
];
export const FILTER_COLOR_OPTIONS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

// ----------------------------------------------------------------------

ShopFilterSidebar.propTypes = {
  openFilter: PropTypes.bool,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  formData: PropTypes.object,
  filterData: PropTypes.object,
  setFilterData: PropTypes.func,
};

export default function ShopFilterSidebar({ openFilter, onOpenFilter, onCloseFilter, formData, filterData, setFilterData }) {
  const boolSelect = [
    {value: true, label: 'Evet'},
    {value: false, label: 'Hayır'},
    {value: 0, label: 'Boş'},
  ]

  console.log(filterData);
  return (
    <>
      <Button disableRipple color="inherit" endIcon={<Iconify icon="ic:round-filter-list" />} onClick={onOpenFilter}>
        Filters&nbsp;
      </Button>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Filtreler
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <div>
              <Typography variant="subtitle1" gutterBottom>
                Danışan
              </Typography>
              <FormGroup>
              <Select value={filterData.client} onChange={(e) => {setFilterData ((past) => {return {...past, client: e.target.value}})}}>
                <MenuItem value={-1}>Seçiniz..</MenuItem>
                {formData?.clients.map (client => <MenuItem key={client.id} value={client.id}>{client.attributes.name}</MenuItem>)}
              </Select>
              </FormGroup>
            </div>

            <div>
              <Typography variant="subtitle1" gutterBottom>
                Kategori
              </Typography>
              <FormGroup>
              <Select value={filterData.session_type} onChange={(e) => {setFilterData ((past) => {return {...past, session_type: e.target.value}})}}>
                <MenuItem value={-1}>Seçiniz..</MenuItem>
                {formData?.sessionTypes.map (type => <MenuItem key={type.id} value={type.id}>{type.attributes.name}</MenuItem>)}
              </Select>
              </FormGroup>
            </div>

            <div>
              <Typography variant="subtitle1" gutterBottom>
                Oda
              </Typography>
              <FormGroup>
              <Select value={filterData.room} onChange={(e) => {setFilterData ((past) => {return {...past, room: e.target.value}})}}>
                <MenuItem value={-1}>Seçiniz..</MenuItem>
                {formData?.rooms.map (room => <MenuItem key={room.id} value={room.id}>{room.attributes.name}</MenuItem>)}
              </Select>
              </FormGroup>
            </div>

            <div>
              <Typography variant="subtitle1" gutterBottom>
                Ödendi
              </Typography>
              <FormGroup>
              <Select value={filterData.is_paid} onChange={(e) => {setFilterData ((past) => {return {...past, is_paid: e.target.value}})}}>
                <MenuItem value={-1}>Seçiniz..</MenuItem>
                {boolSelect.map (bool => <MenuItem key={bool.value} value={bool.value}>{bool.label}</MenuItem>)}
              </Select>
              </FormGroup>
            </div>

            <div>
              <Typography variant="subtitle1" gutterBottom>
                Tamamlandı
              </Typography>
              <FormGroup>
              <Select value={filterData.is_completed} onChange={(e) => {setFilterData ((past) => {return {...past, is_completed: e.target.value}})}}>
                <MenuItem value={-1}>Seçiniz..</MenuItem>
                {boolSelect.map (bool => <MenuItem key={bool.value} value={bool.value}>{bool.label}</MenuItem>)}
              </Select>
              </FormGroup>
            </div>

          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            onClick={() => setFilterData ({
              client: -1,
              room: -1,
              is_paid: -1,
              is_completed: -1,
              session_type: -1,
            })}
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="ic:round-clear-all" />}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
