<template>
  <div id="template-container">
    <el-divider content-position="left">目前已有模板</el-divider>
    <div id="template-header">
      <el-input
        width="40%"
        placeholder="模板名称"
        prefix-icon="el-icon-search"
        v-model.trim="searchText"
      >
      </el-input>
      <el-button id="search-btn" type="primary" plain @click="search">
        搜索
      </el-button>

      <el-button id="reset-btn" type="success" plain @click="reset">
        复原
      </el-button>
    </div>
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 95%"
      :loading="isLoading"
    >
      <el-table-column prop="id" label="ID" width="180" sortable>
      </el-table-column>
      <el-table-column
        prop="templateName"
        label="模板名称"
        width="180"
        sortable
      >
      </el-table-column>
      <el-table-column prop="templateTag" label="模板标签" sortable>
      </el-table-column>
      <el-table-column prop="dockerImageId" label="镜像ID"> </el-table-column>
      <el-table-column prop="creationTime" label="创建时间" sortable>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="success">修改</el-button>
          <el-button type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      id="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageRequest.current"
      :page-sizes="[1, 5, 10, 20, 50, 100]"
      :page-size="pageRequest.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageRequest.total"
    >
    </el-pagination>
  </div>
</template>


<script>
import { doPageAll, doPageByName } from "../../service/project";
export default {
  name: "Templates",
  data() {
    return {
      pageRequest: {
        current: 1,
        size: 5,
        total: 0,
      },
      searchText: "",
      templateList: [],
      isLoading: false,
      isSearch: false,
    };
  },
  methods: {
    pageAll() {
      this.isLoading = true;
      doPageAll(this.pageRequest)
        .then((res) => {
          this.isLoading = false;
          this.pageRequest.total = res.data.data.total;
          this.templateList = res.data.data.records;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    handleSizeChange(size) {
      this.pageRequest.size = size;
      if (this.isSearch) {
        this.search();
      } else {
        this.pageAll();
      }
    },
    handleCurrentChange(size) {
      this.pageRequest.current = size;
      if (this.isSearch) {
        this.search();
      } else {
        this.pageAll();
      }
    },
    search() {
      if (!this.isSearch) {
        this.pageRequest.current = 1;
      }
      this.isLoading = true;
      this.isSearch = true;
      doPageByName({
        ...this.pageRequest,
        templateName: this.searchText,
      })
        .then((res) => {
          this.isLoading = false;
          this.pageRequest.total = res.data.data.total;
          this.templateList = res.data.data.records;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    reset() {
      this.isSearch = false;
      this.pageRequest.current = 1;
      this.pageAll();
    },
  },
  created() {
    this.pageAll();
  },
  computed: {
    tableData() {
      const list = this.templateList;
      return list;
    },
  },
};
</script>


<style scoped>
.el-divider__text {
  font-weight: 800;
  font-size: 0.4rem;
}

#pagination {
  margin-top: 10px;
}

#template-header {
  margin-bottom: 10px;
}

.el-input {
  width: 30%;
}

#search-btn {
  margin-left: 10px;
}
</style>