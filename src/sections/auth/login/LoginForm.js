import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      localStorage.setItem("user", '')
      localStorage.setItem("jwt", '')
      axios.defaults.headers.common.Authorization = null;

      const response = await axios.post('http://109.236.48.26:1337/api/auth/local', {
        identifier: customerId,
        password
      })

      if (response?.jwt) {
        localStorage.setItem("user", JSON.stringify(response?.user))
        localStorage.setItem("jwt", response?.jwt)
        axios.defaults.headers.common.Authorization = `Bearer ${response.jwt}`;
        navigate ('/app/calendar')
      } else {
        toast.error ('error')
      }

    } catch (error) {
      toast.error (error?.message ?? 'error')
      console.log (error)
    }
  }

  return (
    <>
      <Stack spacing={3}>
        <TextField value={customerId} onChange={(e) => setCustomerId (e.target.value)} name="email" label="Email veya Kullanıcı Adı" />

        <TextField
          value={password}
          onChange={(e) => setPassword (e.target.value)}
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

        {/* Beni hatirla: <Checkbox name="remember" label="Remember me" /> */}
      <Stack direction="row" alignItems="center" justifyContent="flex-start" sx={{ my: 2 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={login}>
        Login
      </LoadingButton>
    </>
  );
}
