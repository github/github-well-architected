declare module '*.module.css' {
  const classes: { [key: string]: string };
  export = classes;
}

declare module '*.css' {}