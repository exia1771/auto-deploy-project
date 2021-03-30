<template>
  <div>
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form
        :model="form"
        ref="form"
        :label-width="formLabelWidth"
        :rules="formRules"
      >
        <el-form-item label="名称空间" prop="namespaceId">
          <el-select
            v-model="form.namespaceId"
            placeholder="请选择名称空间"
            filterable
          >
            <el-option
              v-for="(item, index) in namespaceOptions"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="GitTag" prop="gitTag">
          <el-select
            v-model="form.gitTag"
            placeholder="请选择标签"
            filterable
            no-data-text="指定的仓库不存在Tag"
          >
            <el-option
              v-for="(item, index) in tagOptions"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工程构建类型" prop="buildTypeId">
          <el-select
            v-model="form.buildTypeId"
            placeholder="请选择构建类型"
            filterable
            no-data-text="无数据"
          >
            <el-option
              v-for="(item, index) in buildTypeOptions"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工程构建命令" prop="buildCommand">
          <el-input type="textarea" v-model="form.buildCommand"></el-input>
        </el-form-item>
        <el-form-item label="拷贝至容器目录" prop="cpToContainerPath">
          <el-input v-model="form.cpToContainerPath"></el-input>
        </el-form-item>
        <el-form-item label="工程运行命令" prop="runCommand">
          <el-input type="textarea" v-model="form.runCommand"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          :loading="form.loading"
          type="primary"
          @click="saveProjectContainer"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { doSaveProjectContainer } from "../../service/projectContainer";
export default {
  name: "ProjectDeploy",
  data() {
    const checkCpToContainerPath = (rule, value, callback) => {
      if (value.trim().length != 0) {
        const s = value.split(/\s+/);
        if (s.length !== 2) {
          callback(
            new Error("'主机文件或目录'     '容器目录', 中间用空格分隔")
          );
        } else if (s[0].trim().length === 0 || s[1].trim().length === 0) {
          callback(
            new Error("'主机文件或目录'     '容器目录', 中间用空格分隔")
          );
        }
      }
      callback();
    };
    return {
      dialogFormVisible: false,
      form: {
        gitTag: "",
        namespaceId: "",
        buildTypeId: "",
        buildCommand: "",
        runCommand: "",
        cpToContainerPath: "",
        loading: false,
      },

      formRules: {
        namespaceId: [
          { required: true, message: "请选择名称空间", trigger: "blur" },
        ],
        buildTypeId: [
          { required: true, message: "请选择工程构建类型", trigger: "blur" },
        ],
        gitTag: [{ required: true, message: "请选择标签", trigger: "blur" }],
        buildCommand: [
          { required: true, message: "请输入工程构建命令", trigger: "blur" },
          {
            max: 65535,
            message: "长度在最大 65535 个字符",
            trigger: ["blur", "change"],
          },
        ],
        cpToContainerPath: [
          {
            required: true,
            message: "请选择需要拷贝到的容器目录，不存在的目录将会被创建",
            trigger: "blur",
          },
          {
            max: 255,
            message: "长度在最大 255 个字符",
            trigger: ["blur", "change"],
          },
          {
            validator: checkCpToContainerPath,
            trigger: "blur",
          },
        ],
        runCommand: [
          { required: true, message: "请输入工程运行命令", trigger: "blur" },
          {
            max: 255,
            message: "长度在最大 255 个字符",
            trigger: ["blur", "change"],
          },
        ],
      },
      formLabelWidth: "140px",
      project: {},
    };
  },
  props: {
    tagOptions: {
      type: Array,
      default: () => [],
    },
    namespaceOptions: {
      type: Array,
      default: () => [],
    },
    buildTypeOptions: {
      type: Array,
      default: () => [],
    },
  },
  created() {},
  methods: {
    switch() {
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    saveProjectContainer() {
      let validResult = true;
      this.$refs.form.validate((valid) => {
        if (!valid) {
          validResult = false;
          return false;
        }
      });
      if (!validResult) {
        return;
      }
      this.form.loading = true;
      doSaveProjectContainer({
        ...this.form,
        projectId: this.$route.params.id,
      })
        .then(() => {
          this.form = {
            gitTag: "",
            namespaceId: "",
            buildTypeId: "",
            buildCommand: "",
            runCommand: "",
            cpToContainerPath: "",
            loading: false,
          };
          this.dialogFormVisible = false;
          this.$emit("afterSave");
          this.$message.success("保存成功");
        })
        .catch(() => {
          this.form.loading = false;
        });
    },
  },
};
</script>


<style scoped>
</style>