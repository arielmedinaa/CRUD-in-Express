import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { useAuth } from '../core/context/authContext';
import Background from '../assets/backgroundLogin.webp';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión. Por favor, intente nuevamente.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full min-h-screen flex items-center justify-center p-4 md:p-6 bg-slate-100'>
      <div className='w-full max-w-[95%] md:max-w-4xl xl:max-w-6xl h-auto md:h-[600px] lg:h-[700px] flex flex-col md:flex-row rounded-3xl md:rounded-4xl overflow-hidden shadow-2xl bg-white md:p-3 lg:p-4'>
        <div className='md:hidden w-full h-48 relative'>
          <div className='absolute inset-0 rounded-t-3xl' style={{ background: 'linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(30, 27, 75, 0.9))', mixBlendMode: 'multiply' }} />
          <img
            src={Background}
            alt='Background'
            className='w-full h-full object-cover rounded-t-3xl'
          />
          <div className='absolute inset-0 flex flex-col justify-center p-4 text-white text-center'>
            <h1 className='text-2xl font-bold'>Bienvenido a <span className='text-indigo-300'>Inventario</span></h1>
            <p className='text-indigo-100 text-sm'>Gestiona tu inventario de forma eficiente y organizada</p>
          </div>
        </div>
        <div className='hidden md:flex md:w-1/2 relative'>
          <div className='absolute inset-0 rounded-4xl' style={{ background: 'linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(30, 27, 75, 0.9))', mixBlendMode: 'multiply' }} />
          <img
            src={Background}
            alt='Background'
            className='w-full h-full object-cover rounded-4xl'
          />
          <div className='absolute inset-0 flex flex-col justify-center p-10 text-white rounded-4xl'>
            <h1 className='text-3xl md:text-4xl font-bold mb-3 md:mb-4'>Bienvenido a <span className='text-indigo-300'>Inventario</span></h1>
            <p className='text-indigo-100 text-sm md:text-base'>Gestiona tu inventario de forma eficiente y organizada</p>
          </div>
        </div>
        <div className='w-full md:w-1/2 p-6 sm:p-8 md:p-10 bg-white overflow-y-auto'>
          <div className='mb-10'>
            <h2 className='text-2xl sm:text-3xl font-bold text-indigo-400'>Iniciar Sesión</h2>
            <p className='text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base'>Ingresa tus credenciales para continuar</p>
          </div>

          {error && (
            <div className='mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-400'>
                <FaUser />
              </div>
              <input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent outline-none transition'
                placeholder='Correo electrónico'
                required
              />
            </div>

            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-400'>
                <FaLock />
              </div>
              <input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent outline-none transition'
                placeholder='Contraseña'
                required
              />
            </div>

            <div className='flex items-center justify-between'>
              <label className='flex items-center text-sm text-gray-600'>
                <input type='checkbox' className='rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500' />
                <span className='ml-2'>Recordarme</span>
              </label>
              <a href='#' className='text-sm font-medium text-indigo-600 hover:text-indigo-500'>
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full text-white font-medium py-3 px-4 rounded-full shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center'
              style={{ background: 'linear-gradient(to right, #4f46e5, #7c3aed)' }}
              onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #4338ca, #6d28d9)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #4f46e5, #7c3aed)'}
            >
              {loading ? (
                <>
                  <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Iniciando sesión...
                </>
              ) : 'Iniciar Sesión'}
            </button>

            <div className='relative mt-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>O usa credenciales de prueba</span>
              </div>
            </div>
          </form>

          <div className='mt-8 text-center text-sm text-gray-500'>
            <p>¿Necesitas ayuda? <a href='#' className='font-medium text-indigo-600 hover:text-indigo-500'>Contáctanos</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;