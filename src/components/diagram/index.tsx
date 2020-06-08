import React, { useRef, useEffect, useLayoutEffect, useMemo } from "react";
import { mxgraph, mxgraphFactory } from "ts-mxgraph";

const { mxGraph, mxGraphModel, mxCell, mxGeometry, mxPoint } = mxgraphFactory({
  mxLoadResources: false,
  mxLoadStylesheets: false,
});

export default function Diagram(props:any) {

    const wrapperRef = useRef<Element | null>((null as unknown) as HTMLElement);

    const graph = useRef<mxgraph.mxGraph | null>(null);

    console.log("DADAD")

    useLayoutEffect(() => {
        const root = new mxCell('hello');
        root.children = [new mxCell('Lelele')]
        const model: mxgraph.mxGraphModel = new mxGraphModel(root);
        const graphInstance = new mxGraph(wrapperRef.current as Element, model);
        graph.current = graphInstance;
    }, [])

    const wrapperDiv = useMemo(() => (
    <div ref={wrapperRef as any} id='diagram-container'> 
    </div>), [])

    return wrapperDiv;
}