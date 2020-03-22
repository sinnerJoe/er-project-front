import React, { useReducer, useState, ComponentType, useCallback, useRef } from 'react';

export type CursorType = 'e-resize'
                        | 's-resize'
                        | 'sw-resize'
                        | 'se-resize'
                        | 'grab'
                        | 'inherit'

export const CursorDispatch = React.createContext<((c: CursorType) => void)>(() => {});

export function withCursorStyle<P extends Object> (Component: React.ComponentType<P>): React.FC<P> {
  
  return (props: P) => {
    let divRef = useRef<HTMLDivElement>(null);
    let cursor = useRef<CursorType>('inherit');
    
    const changeCursorStyle = useCallback((nextCursor: CursorType) => { 
      if(cursor.current !== nextCursor) {
        (divRef.current as any).style = `cursor: ${nextCursor}`;
        cursor.current = nextCursor;
      }
    }, [divRef]);
      
      return (
      <div ref={divRef}>
        <CursorDispatch.Provider value={changeCursorStyle}>
          <Component {...props as P} />
        </CursorDispatch.Provider>
      </div>
    )
  }
}