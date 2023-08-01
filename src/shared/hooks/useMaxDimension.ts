import { useSelector } from 'react-redux';

function useMaxDimensions() {
  const sidebarOpen = useSelector((state: any) => state.admin.ui.sidebarOpen);
  return {
    width: sidebarOpen ? 'calc(100vw - 310px)' : 'calc(100vw - 125px)',
    height: 'calc(100vh - 136px)',
  };
}

export default useMaxDimensions;
