declare const _default: (api: object, options: Record<string, any> | null | undefined, dirname: string) => {
    visitor: {
        CallExpression(this: import("@babel/core").PluginPass, path: import("@babel/traverse").NodePath<import("@babel/types").CallExpression>): void;
    };
};
export default _default;
