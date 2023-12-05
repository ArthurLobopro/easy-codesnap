

export const setSessionConfig = (config) => {
    if (alreadyHasSessionConfig()) {
        config = { ...getSessionConfig(), ...config }
    }

    sessionStorage.setItem("easy-codesnap-config", JSON.stringify(config))
}

export const getSessionConfig = () => {
    return JSON.parse(sessionStorage.getItem("easy-codesnap-config"))
}

export const alreadyHasSessionConfig = () => {
    return !!sessionStorage.getItem("easy-codesnap-config")
}
