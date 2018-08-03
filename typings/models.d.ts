/**
 * 用于声明来自 server 的 api 返回值中的数据格式
 * 此 namespace 中的声明必须只包含 server api 返回值中存在的字段
 * 如果要加入 view 层独有的数据字段，可以继承并扩展各 dataModel
 */
declare namespace DataModels {
  /**
   * 基础 dataModel，几乎所有的 dataModel 都会继承此 dataModel
   */
  interface BaseModel {
    id: string;
    createdAt: number;
    updatedAt: number;
  }
}
