import { Route, Routes } from 'react-router-dom';
import { MainPage } from './pages/MainPage/MainPage';
import { ItemPage } from './pages/ItemPage/ItemPage';
import { EditPage } from './pages/EditPage/EditPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/ads/:id" element={<ItemPage />} />
      <Route path="/ads/:id/edit" element={<EditPage />} />
    </Routes>
  );
}

export default App;
