import paths from 'paths';
import  MyDiagramsPage from 'pages/my-diagrams/MyDiagramsPage';
import  CreateDiagram from 'pages/create-diagram/CreateDiagram';
import EditDiagramPage from 'pages/edit-diagram/EditDiagramPage';
export default [
    {
        path: paths.MY_DIAGRAM,
        component: MyDiagramsPage
    },
    {
        path: paths.NEW_DIAGRAM,
        component: CreateDiagram,
        disableHeader: false,
    },
    {
        path: paths.EDIT_DIAGRAM,
        component: EditDiagramPage,
        disableHeader: true,
    }
] as {path: string, component: any, disableHeader?: boolean}[];