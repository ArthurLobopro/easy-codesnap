declare module "svgo/dist/svgo.browser" {
  export * from "svgo";
}

declare module "*.svg" {
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
}

declare type PropsWithClassName = { className?: string };
