export type ExtractProps<P> = P extends React.Component<infer T> ? T : never;