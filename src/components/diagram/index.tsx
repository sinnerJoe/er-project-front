import React, { useRef, useEffect, useLayoutEffect, useMemo } from "react";
import { mxgraph, mxgraphFactory } from "ts-mxgraph";
import domtoimage from 'dom-to-image'
// import domtoimage from 'dom-to-image-more';
import {Image} from 'image-js';
import { IMG_FALLBACK } from "shared/constants";
const { mxGraph, mxGraphModel, mxCell, mxGeometry, mxPoint } = mxgraphFactory({
  mxLoadResources: false,
  mxLoadStylesheets: false,
});

declare var mxUtils: any;
declare var mxResources: any;
declare var Graph: any;
declare var urlParams: any;
declare var EditorUi: any;
declare var Editor: any;
declare var RESOURCE_BASE: any;
declare var STYLE_PATH: any;
declare var mxLanguage: any;

const CANVAS_ID = 'capture_canvas';

function capturePoster() {
  const diagramSvg = document.querySelector('.geDiagramContainer > svg') as HTMLElement
  const fullImage = domtoimage.toPng(diagramSvg).catch(() => IMG_FALLBACK);
  return fullImage
}

function initDiagram(element: any, cb: any, config: { 
  defaultSetup: {
    schema: string, 
    diagramType: string
    label: string}[], 
    onSave: (graphData: any) => void,
    viewMode: boolean
  }) {
  var editorUiInit = EditorUi.prototype.init;
  EditorUi.prototype.init = function () {
    editorUiInit.apply(this, arguments);
    this.actions.get("export").setEnabled(false);

    // Updates action states which require a backend
  };
  // Adds required resources (disables loading of fallback properties, this can only
  // be used if we know that all keys are defined in the language specific file)
  mxResources.loadDefaultBundle = false;
  let bundle =
    mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) ||
    mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage);

  // Fixes possible asynchronous requests
  mxUtils.getAll(
    [bundle, STYLE_PATH + "/default.xml"],
    function (xhr: any) {
      // Adds bundle text to resources
      mxResources.parse(xhr[0].getText());

      // Configures the default graph theme
      const themeIndex: string = Graph.prototype.defaultThemeName;
      const themes = {
        [themeIndex]: xhr[1].getDocumentElement(),
      };
      const defaultSetup = config.defaultSetup.map(({schema, label, diagramType})=> 
              ({label, diagramType, textSchema: schema}));

      const editor = new Editor(urlParams["chrome"] == "0", themes)
      

      const editorUi = new EditorUi(
        // eslint-disable-next-line eqeqeq
        editor,
        element,
        undefined,
        { 
          ...config, 
          defaultSetup,
          capturePoster
        },
      );
      cb(editorUi);
    },
    function () {
      // document.body.innerHTML =
      //   '<center style="margin-top:10%;">Error loading resource files. Please check browser console.</center>';
    }
  );
}

type Props = {
  defaultSetup: any,
  onSave: (xmlData: any[]) => void,
  viewMode?: boolean;
}

export default function Diagram({defaultSetup, onSave, viewMode=false}: Props) {

    const wrapperRef = useRef<Element | null>((null as unknown) as HTMLElement);
    const editorUi = useRef<any>(null);
    const graph = useRef<mxgraph.mxGraph | null>(null);

    useLayoutEffect(() => {
        initDiagram(wrapperRef.current, (editor:any) => {editorUi.current = editor}, {
          defaultSetup: defaultSetup.map((({title, diagramXml, type}: any) => ({
            label: title, 
            schema: diagramXml, 
            diagramType: type
          }))),
          onSave: (xmlData) => {
            onSave(xmlData);
          },
          viewMode
        });
        return () => {
          if(editorUi.current) {
            editorUi.current.editor.modified = false;
            delete (document as any).onbeforeunload;
            document.querySelector('body > .mxPopupMenu')?.remove(); //remove 1px X 1px div that creates scroll for the whole page
            document.querySelector('body > div:last-child')?.remove(); //remove 1px X 1px div that creates scroll for the whole page
          }
        }
    }, [])

    const wrapperDiv = useMemo(() => (
    <>
    <canvas id={CANVAS_ID}/>
    <div ref={wrapperRef as any} className='geEditor'/> 
    </>), [])

    return wrapperDiv;
}

Diagram.defaultProps = {
  onSave: () => {}
}