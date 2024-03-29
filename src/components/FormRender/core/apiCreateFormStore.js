import { isDef, isFunction } from "@/utils";
import { apiCreateFormValidator } from "@/components/FormRender/core/apiCreateFormValidator";
export function apiCreateFormStore(createFormComponent) {
    function createStore(loadOptions) {
        let componentInstanceRecord = Object.create(null);
        const store = {
            loadOptions,
            clear() {
                componentInstanceRecord = Object.create(null);
            },
            register(k, VNode) {
                if (k) {
                    componentInstanceRecord[k] = VNode;
                }
            },
            getValue(...keys) {
                if (keys.length === 1) {
                    return (
                        componentInstanceRecord[keys[0]] &&
                        componentInstanceRecord[keys[0]].getValue()
                    );
                }
                if (!keys.length) {
                    keys = Object.keys(componentInstanceRecord);
                }
                return keys.reduce((res, key) => {
                    const instance = componentInstanceRecord[key];
                    if (instance) {
                        res[key] = instance.getValue();
                    }
                    return res;
                }, {});
            },
            setValue(newValue) {
                Object.keys(newValue).forEach((k) => {
                    const fileNode = componentInstanceRecord[k];
                    fileNode && fileNode.setValue(newValue[k]);
                });
            },
            resetValue() {
                Object.values(componentInstanceRecord).forEach((fieldNode) =>
                    fieldNode.resetValue()
                );
            },
        };

        const buildValidator = apiCreateFormValidator(store);
        store.FormControlComponent = createFormComponent(store);
        store.buildValidator = function (field) {
            const validator = buildValidator(field);
            if (validator) {
                return {
                    required: !isFunction(field.validator) ?? (field.validator || "").indexOf("required") > -1,
                    validator,
                    trigger: isDef(field.trigger)
                        ? field.trigger
                        : field.component === "el-input"
                        ? "blur"
                        : "change",
                };
            }
        };
        return store;
    }

    return { createStore };
}
