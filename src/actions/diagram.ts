import Axios from "axios";
import { Solution } from "interfaces/Solution";
import {testInput, diagramImage} from 'constant/test-consts'
let diagrams: {[key: number] : Solution} = {
    1: {
       id: 1,
       assignments: [{
           id: 1,
           title: 'Proiectati diagrama ER pentru facultatea de informatica.'
       }],
       updatedOn: new Date().toISOString(), 
       tabs: [
           {
               diagramXml: testInput,
               poster: diagramImage, 
               title: 'First tab'
           },
           {
               diagramXml: testInput,
               poster: diagramImage, 
               title: 'Second tab'
           }
       ] 
    } as Solution,
    2: {
       id: 2,
       assignments: [{
           id: 2,
           title: 'Proiectati diagrama ER pentru facultatea de informatica.'
       }],
       updatedOn: new Date().toISOString(), 
       tabs: [
           {
               diagramXml: testInput,
               poster: diagramImage, 
               title: 'First tab'
           },
           {
               diagramXml: testInput,
               poster: diagramImage, 
               title: 'Second tab'
           }
       ] 
    } as Solution   
}; 

const fakeGet = (value: any) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(value), 200);
    })
}

export const getSolution = (diagramId: any): any => {
     console.log('getSolution', diagrams[diagramId])
     return fakeGet(diagrams[diagramId] as any);   
}

export const saveSolution = (solutionData: Solution) => {
    diagrams[solutionData.id] = solutionData;
    diagrams = {...diagrams};
    console.log("SAVE SOLUTION", diagrams)
    return fakeGet({status: 'Ok'})
}

export const getSolutions = () => {
     return fakeGet(Object.values(diagrams));   
}
export const deleteDiagram = (diagramId:any) => {
    delete diagrams[diagramId];
    return fakeGet({status: 'OK'});
}

export const createSolution = (tabs: any) => {
    const solution: Solution = {
        id: Object.values(diagrams).reduce((acc, v) => Math.max(acc, v.id), 0) + 1,
        assignments: [],
        tabs,
        updatedOn: new Date().toISOString()
    };

    diagrams[solution.id] = solution;

    return fakeGet({status: 'OK'});
}
