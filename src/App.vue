<template>
    <div id="app">
        <FormRender
            ref="formRender"
            :fields="fields"
            :load-options="loadOptions"
        >
            <template #tip>
                {{ $refs.formRender?.getModel().like }}
            </template>
        </FormRender>
        <el-button @click="handleSubmit">提交</el-button>
        <el-button @click="handleReset">重置</el-button>
    </div>
</template>

<script>
import FormRender from "@/components/FormRender";
export default {
    name: "App",
    components: { FormRender },
    data() {
        return {
            fields: [
                {
                    prop: "name",
                    label: "姓名",
                    component: "el-input",
                    labelWidth: 90,
                    validator: `required;maxLength=5`,
                },
                {
                    prop: "age",
                    label: "年龄",
                    component: "el-input",
                    labelWidth: 90,
                    validator: `required;numeric=请输入数字;max=20`,
                },
                {
                    prop: "like",
                    label: "爱好",
                    component: "el-select",
                    labelWidth: 90,
                    validator: (value, Validator) => {
                        console.log(value, Validator);
                        if (!value) {
                            return Validator.error("你不能没有爱好");
                        } else if (value === 2) {
                            return Validator.error("你只能喜欢篮球");
                        }
                    },
                    options: [
                        { label: "篮球", value: 1 },
                        { label: "足球", value: 2 },
                    ],
                },
                {
                    prop: "lang",
                    label: "语言",
                    component: "el-select",
                    labelWidth: 90,
                    validator: `required`,
                    options: {
                        isDynamic: true,
                        loadOptions: this.loadLangOptions,
                    },
                },
                {
                    prop: "tip",
                    slot: "tip",
                },
                {
                    prop: "h",
                    component: (h, context) => {
                        console.log(h, context);
                        return h(
                            "el-button",
                            {
                                props: {
                                    type: "danger",
                                    style: { padding: "5px 10px" },
                                },
                                style: { padding: "10px 12px" },
                                attrs: {},
                                on: {
                                    click: () => this.btnClick(context),
                                },
                            },
                            "确认"
                        );
                    },
                },
            ],
        };
    },
    methods: {
        loadOptions(field) {
            console.log(field);
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve([
                        { value: "1", label: "Java" },
                        { value: "2", label: "Go" },
                    ]);
                }, 1000);
            });
        },
        async handleSubmit() {
            const valid = await this.$refs.formRender.validate();
            if (valid) {
                console.log(this.$refs.formRender.getModel());
                console.log("Submit!");
            }
        },
        handleReset() {
            this.$refs.formRender.resetModel();
        },
        loadLangOptions(field) {
            console.log(field);
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve([{ value: "3", label: "JavaScript" }]);
                }, 1000);
            });
        },
        async btnClick(context) {
            console.log("~~~~~~~", context);
            alert(
                `Click~ ${JSON.stringify(this.$refs.formRender.getModel())}`
            );
        },
    },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
.el-input,
.el-select {
    width: 100%;
}
</style>
