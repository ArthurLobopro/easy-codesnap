/** biome-ignore-all lint/correctness/useHookAtTopLevel: <explanation> */
import { type ISessionConfig, useSessionConfig } from "../../../SessionConfig";

type PickProperties<T, K extends keyof T> = {
    [P in K]: T[P];
};

export function useConfigList<T extends keyof Omit<ISessionConfig, "set">>(
    keys: readonly T[],
) {
    const obj = {} as Record<T, ISessionConfig[T]>;

    for (const key of keys) {
        obj[key] = useConfig(key);
    }

    return obj as PickProperties<Omit<ISessionConfig, "set">, T> &
        Pick<ISessionConfig, "set">;
}

export function useConfig<T extends keyof Omit<ISessionConfig, "set">>(key: T) {
    return useSessionConfig((state) => state[key]);
}

export function useSetConfig() {
    return useSessionConfig((state) => state.set);
}
