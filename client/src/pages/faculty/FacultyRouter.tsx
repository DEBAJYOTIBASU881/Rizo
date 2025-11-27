import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FacultyDashboard from '../FacultyDashboard';
import StudentList from './students/StudentList';
import StudentCreate from './students/StudentCreate';
import MarksManagement from './marks/MarksManagement';
import QueriesManagement from './queries/QueriesManagement';
import PollCreate from './polls/PollCreate';
import PollsManagement from './polls/PollsManagement';
import AnnouncementCreate from './announcements/AnnouncementCreate';

const FacultyRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/dashboard" element={<FacultyDashboard />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/students/create" element={<StudentCreate />} />
            <Route path="/marks" element={<MarksManagement />} />
            <Route path="/queries" element={<QueriesManagement />} />
            <Route path="/polls" element={<PollsManagement />} />
            <Route path="/polls/create" element={<PollCreate />} />
            <Route path="/announcements/create" element={<AnnouncementCreate />} />
        </Routes>
    );
};

export default FacultyRouter;
