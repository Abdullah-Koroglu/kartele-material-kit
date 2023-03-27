// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Takvim',
    path: '/app/calendar',
    icon: icon('ic_calendar'),
  },
  {
    title: 'Seans Ekle',
    path: '/app/create_session',
    icon: icon('ic_clock'),
  },
  {
    title: 'Seanslarım',
    path: '/app/my_session',
    icon: icon('ic_list'),
  },
  {
    title: 'Danışanlarım',
    path: '/app/my_clients',
    icon: icon('ic_user'),
  }
];

export default navConfig;
