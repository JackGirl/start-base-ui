

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
};