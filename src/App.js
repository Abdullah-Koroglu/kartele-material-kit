import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';

// ----------------------------------------------------------------------

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL
axios.defaults.headers.common.Authorization = localStorage.getItem ('jwt') ? `Bearer ${localStorage.getItem ('jwt')}` : null;


axios.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      window.location.href = '/app';
    } else if (error.response?.status === 403) {
      localStorage.removeItem('jwt')
      localStorage.removeItem('user')
      axios.defaults.headers.common.Authorization = null;
    }
    return error.response.data
});

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <StyledChart />
          <Router />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
