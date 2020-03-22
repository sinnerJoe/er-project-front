
import React, {Context, ElementType} from 'react';

type PropTypes = {
  render: (element: JSX.Element) => JSX.Element,
  contexts: Context<any>[] | Context<any>,
  children: JSX.Element[] | JSX.Element
}

const ContextBridge = <P extends Object>(props: PropTypes & P) => { 
  const { render, contexts, children, ...rest } = props
  if (Array.isArray(contexts) && contexts.length > 1) {
    const [FirstContext, ...remainingContexts] = contexts;
    const nextProps = {
      contexts: remainingContexts,
      render,
      children: (
        <FirstContext.Consumer>
          { value =>
            <FirstContext.Provider value={value}>{children}</FirstContext.Provider>
          }
        </FirstContext.Consumer>
      ),
      ...rest
    }
    return <ContextBridge {...nextProps}/>
  }
  const LastContext = Array.isArray(contexts) ? contexts[0] : contexts;

  return (
    <LastContext.Consumer>
      {value =>
        render(<LastContext.Provider value={value}>{children}</LastContext.Provider>)
      }
    </LastContext.Consumer>
  )

  };