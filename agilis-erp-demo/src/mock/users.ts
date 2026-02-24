import type { User } from '@/types';

export const users: User[] = [
  { id: 'u1', name: '张伟', nameEn: 'Wei Zhang', email: 'zhang.wei@agilis.com', role: 'admin', avatar: '', department: '系统管理' },
  { id: 'u2', name: '李明', nameEn: 'Ming Li', email: 'li.ming@agilis.com', role: 'supply_chain_manager', avatar: '', department: '供应链' },
  { id: 'u3', name: '王芳', nameEn: 'Fang Wang', email: 'wang.fang@agilis.com', role: 'engineer', avatar: '', department: '工程部' },
  { id: 'u4', name: '陈刚', nameEn: 'Gang Chen', email: 'chen.gang@agilis.com', role: 'quality_manager', avatar: '', department: '质量部' },
  { id: 'u5', name: '赵静', nameEn: 'Jing Zhao', email: 'zhao.jing@agilis.com', role: 'warehouse_staff', avatar: '', department: '仓储部' },
  { id: 'u6', name: '刘洋', nameEn: 'Yang Liu', email: 'liu.yang@agilis.com', role: 'production_manager', avatar: '', department: '生产部' },
  { id: 'u7', name: '黄强', nameEn: 'Qiang Huang', email: 'huang.qiang@agilis.com', role: 'general_manager', avatar: '', department: '总经理办公室' },
];

export const currentUser = users[1]; // Li Ming, supply chain
