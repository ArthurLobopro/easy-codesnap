import { type ISessionConfig, useSessionConfig } from "../../../SessionConfig";

type PickProperties<T, K extends keyof T> = {
    [P in K]: T[P];
};

export function useConfig<T extends keyof Omit<ISessionConfig, "set">>(
    keys: readonly T[],
) {
    const obj = {
        set: useSessionConfig((state) => state.set),
    };

    for (const key of keys) {
        //@ts-ignore
        // biome-ignore lint/correctness/useHookAtTopLevel: It actyaly works
        obj[key] = useSessionConfig((state) => state[key]);
    }

    return obj as PickProperties<Omit<ISessionConfig, "set">, T> &
        Pick<ISessionConfig, "set">;
}
