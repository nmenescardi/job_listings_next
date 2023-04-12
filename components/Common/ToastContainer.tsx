import { ToastContainer as ToastContainerLibrary } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContainer = () => (
  <ToastContainerLibrary
    position="top-right"
    autoClose={5000}
    hideProgressBar
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss={false}
    draggable={false}
    pauseOnHover={true}
  />
);

export default ToastContainer;
