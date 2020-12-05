export interface ExpectedDiagram {
        content: string, 
        name: string, 
        image: string
}
export interface ExpectedSolution{
    title: string,
    diagrams: ExpectedDiagram[],
}