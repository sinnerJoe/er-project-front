import paths from 'paths';
import  MyDiagramsPage from 'pages/my-diagrams/MyDiagramsPage';
import  CreateDiagram from 'pages/create-diagram/CreateDiagram';
import EditDiagramPage from 'pages/edit-diagram/EditDiagramPage';
import MyAssignmentsPage from 'pages/my-assignments/MyAssignmentsPage';
import EditAssignmentPage from 'pages/edit-assignment/EditAssignmentPage';
import ProfessorAssignmentsPage from 'pages/professor-assignments-page/ProfessorAssignmentsPage';
export default [
    {
        path: paths.MY_DIAGRAM,
        component: MyDiagramsPage
    },
    {
        path: paths.NEW_DIAGRAM,
        component: CreateDiagram,
        disableHeader: true,
    },
    {
        path: paths.EDIT_DIAGRAM,
        component: EditDiagramPage,
        disableHeader: true,
    },
    {
        path: paths.STUDENT_ASSIGNMENTS,
        component: MyAssignmentsPage
    },
    {
        path: `${paths.EDIT_ASSIGNMENT}/:id?`,
        component: EditAssignmentPage
    },
    {
        path: `${paths.PROFESSOR_ASSIGNMENTS}`,
        component: ProfessorAssignmentsPage
    }
] as {path: string, component: any, disableHeader?: boolean}[];