import { Route, Routes } from 'react-router-dom';
import { MainPage } from './pages/MainPage/MainPage';
import { ItemPage } from './pages/ItemPage/ItemPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/ads/:id" element={<ItemPage />} />
    </Routes>
  );
}

export default App;
