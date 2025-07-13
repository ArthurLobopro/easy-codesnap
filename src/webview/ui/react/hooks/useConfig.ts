/** biome-ignore-all lint/correctness/useHookAtTopLevel: It works here because arrays are constants */
import { useMemo } from "react";
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

  return obj as PickProperties<ISessionConfig, T>;
}

export function useConfig<T extends keyof Omit<ISessionConfig, "set">>(key: T) {
  return useSessionConfig((state) => state[key]);
}

type BooleanKeys<T> = {
  [K in keyof T]: T[K] extends boolean ? K : never;
}[keyof T];

export function useSetConfig() {
  const set = useSessionConfig((state) => state.set);

  type set = ISessionConfig["set"];

  interface ModifiedSet {
    (config: Parameters<set>[0]): void;
    set: set;
    toggle: (key: BooleanKeys<ISessionConfig>) => void;
    toggleCallback: (key: BooleanKeys<ISessionConfig>) => () => void;
  }

  return useMemo(() => {
    const modifiedSet: ModifiedSet = (config: Parameters<set>[0]) => {
      set(config);
    };

    modifiedSet.set = set;

    const toggle: ModifiedSet["toggle"] = (key) => {
      set({
        [key]: !useSessionConfig.getState()[key],
      });
    };

    modifiedSet.toggle = toggle;
    modifiedSet.toggleCallback = (key) => {
      return () => toggle(key);
    };

    return modifiedSet as ModifiedSet;
  }, [set]);
}
