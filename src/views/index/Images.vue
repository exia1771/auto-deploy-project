<template>
  <div>
    <el-divider content-position="left" class="title">目前已有镜像</el-divider>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      :loading="isLoading"
      :border="true"
    >
      <el-table-column prop="id" label="镜像ID" width="180"> </el-table-column>
      <el-table-column prop="repoTags" label="仓库标签" width="180">
      </el-table-column>
      <el-table-column prop="createdTime" label="创建时间" width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-document"
            type="info"
            plain
            @click="inspect(scope.row.id)"
            v-loading.fullscreen.lock="isInspect"
          >
            详细信息
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="详细信息" :visible.sync="dialogVisible" width="60%">
      <json-viewer
        :value="inspectData"
        :expand-depth="5"
        copyable
        boxed
        sort
      ></json-viewer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { doFindImage, doInspect } from "../../service/docker.js";
export default {
  name: "Images",
  data() {
    return {
      imageList: [],
      isLoading: false,
      inspectData: {},
      isInspect: false,
      dialogVisible: false,
    };
  },
  methods: {
    findImage() {
      this.isLoading = true;
      const findParam = {
        all: true,
        limit: 40,
      };
      doFindImage(findParam)
        .then((res) => {
          this.imageList = res.data.data;
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    inspect(id) {
      this.isInspect = true;
      doInspect(id)
        .then((res) => {
          this.isInspect = false;
          this.inspectData = res.data.data;
          this.dialogVisible = true;
        })
        .catch(() => {
          this.isInspect = false;
        });
    },
  },
  computed: {
    tableData() {
      const list = this.imageList;
      const start = 7;
      const end = 7 * 3;
      if (list !== null || list !== undefined || list.length != 0) {
        list.forEach((v) => {
          v.id = v.id.substring(start, end);
          v.repoTags = v.repoTags[0];
        });
      }

      return list;
    },
  },
  created() {
    this.findImage();
  },
};
</script>


<style scoped>
.el-divider__text {
  font-weight: 800;
  font-size: 0.4rem;
}

.jv-container {
  font-size: 0.4rem;
}
</style>