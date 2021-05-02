

export const paginationMixin = {
  data() {
    return {
      pager: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  methods:{
    setPager(res){
      this.pager.pageSize = res.data.pageSize;
      this.pager.current = res.data.current;
      this.pager.total = res.data.total;
    }
  }
};