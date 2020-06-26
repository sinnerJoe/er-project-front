import React, { useRef, useEffect, useLayoutEffect, useMemo } from "react";
import { mxgraph, mxgraphFactory } from "ts-mxgraph";

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

function initDiagram(element: any, cb: any, config: { onSave: (graphData: any) => void }) {
  var editorUiInit = EditorUi.prototype.init;

  EditorUi.prototype.init = function () {
    editorUiInit.apply(this, arguments);
    this.actions.get("export").setEnabled(false);

    // Updates action states which require a backend
    if (!Editor.useLocalStorage) {
      setTimeout(
        mxUtils.bind(this, function (this: any) {
          var enabled = true;
          // this.actions.get("open").setEnabled(enabled || Graph.fileSupport);
          this.actions.get("import").setEnabled(enabled || Graph.fileSupport);
          this.actions.get("save").setEnabled(enabled);
          this.actions.get("saveAs").setEnabled(enabled);
          this.actions.get("export").setEnabled(enabled);
        }),
        0
      );
    }
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
      console.log(themes);
      // Main
      const editor = new EditorUi(
        // eslint-disable-next-line eqeqeq
        new Editor(urlParams["chrome"] == "0", themes),
        element,
        undefined,
        config,
      );
      cb(editor);
    },
    function () {
      // document.body.innerHTML =
      //   '<center style="margin-top:10%;">Error loading resource files. Please check browser console.</center>';
    }
  );
}

export default function Diagram(props:any) {

    const wrapperRef = useRef<Element | null>((null as unknown) as HTMLElement);

    const graph = useRef<mxgraph.mxGraph | null>(null);

    console.log("DADAD")

    useLayoutEffect(() => {
        initDiagram(wrapperRef.current, () => {}, { 
          onSave: (xmlData) => {
            console.log(xmlData);
          } 
        });
    }, [])

    const wrapperDiv = useMemo(() => (
    <div ref={wrapperRef as any} className='geEditor'> 
    </div>), [])

    return wrapperDiv;
}