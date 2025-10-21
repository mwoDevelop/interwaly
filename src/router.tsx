import { createHashRouter } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { RecognizePage } from './pages/RecognizePage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { SingPage } from './pages/SingPage';
import { ComparePage } from './pages/ComparePage';
import { AssocPage } from './pages/AssocPage';

export const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'recognize', element: <RecognizePage /> },
      { path: 'flashcards', element: <FlashcardsPage /> },
      { path: 'sing', element: <SingPage /> },
      { path: 'compare', element: <ComparePage /> },
      { path: 'assoc', element: <AssocPage /> }
    ]
  }
]);
