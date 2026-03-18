// lib/china-data.ts v1.0.0

export interface ChinaRegion {
  name: string;
  children?: ChinaRegion[];
}

export const CHINA_REGIONS: ChinaRegion[] = [
  {
    name: "北京",
    children: [
      { name: "北京市", children: [{ name: "东城区" }, { name: "西城区" }, { name: "朝阳区" }, { name: "丰台区" }, { name: "石景山区" }, { name: "海淀区" }, { name: "门头沟区" }, { name: "房山区" }, { name: "通州区" }, { name: "顺义区" }, { name: "昌平区" }, { name: "大兴区" }, { name: "怀柔区" }, { name: "平谷区" }, { name: "密云区" }, { name: "延庆区" }] }
    ]
  },
  {
    name: "上海",
    children: [
      { name: "上海市", children: [{ name: "黄浦区" }, { name: "徐汇区" }, { name: "长宁区" }, { name: "静安区" }, { name: "普陀区" }, { name: "虹口区" }, { name: "杨浦区" }, { name: "闵行区" }, { name: "宝山区" }, { name: "嘉定区" }, { name: "浦东新区" }, { name: "金山区" }, { name: "松江区" }, { name: "青浦区" }, { name: "奉贤区" }, { name: "崇明区" }] }
    ]
  },
  {
    name: "广东",
    children: [
      { name: "广州", children: [{ name: "越秀区" }, { name: "荔湾区" }, { name: "海珠区" }, { name: "天河区" }, { name: "白云区" }, { name: "黄埔区" }, { name: "番禺区" }, { name: "花都区" }, { name: "南沙区" }, { name: "从化区" }, { name: "增城区" }] },
      { name: "深圳", children: [{ name: "罗湖区" }, { name: "福田区" }, { name: "南山区" }, { name: "宝安区" }, { name: "龙岗区" }, { name: "盐田区" }, { name: "龙华区" }, { name: "坪山区" }, { name: "光明区" }] },
      { name: "珠海", children: [{ name: "香洲区" }, { name: "斗门区" }, { name: "金湾区" }] },
      { name: "汕头", children: [{ name: "龙湖区" }, { name: "金平区" }, { name: "濠江区" }, { name: "潮阳区" }, { name: "潮南区" }, { name: "澄海区" }, { name: "南澳县" }] },
      { name: "佛山", children: [{ name: "禅城区" }, { name: "南海区" }, { name: "顺德区" }, { name: "三水区" }, { name: "高明区" }] }
    ]
  },
  {
    name: "浙江",
    children: [
      { name: "杭州", children: [{ name: "上城区" }, { name: "拱墅区" }, { name: "西湖区" }, { name: "滨江区" }, { name: "萧山区" }, { name: "余杭区" }, { name: "富阳区" }, { name: "临安区" }, { name: "临平区" }, { name: "钱塘区" }, { name: "桐庐县" }, { name: "淳安县" }, { name: "建德市" }] },
      { name: "宁波", children: [{ name: "海曙区" }, { name: "江北区" }, { name: "北仑区" }, { name: "镇海区" }, { name: "鄞州区" }, { name: "奉化区" }, { name: "象山县" }, { name: "宁海县" }, { name: "余姚市" }, { name: "慈溪市" }] },
      { name: "温州", children: [{ name: "鹿城区" }, { name: "龙湾区" }, { name: "瓯海区" }, { name: "洞头区" }, { name: "永嘉县" }, { name: "平阳县" }, { name: "苍南县" }, { name: "文成县" }, { name: "泰顺县" }, { name: "瑞安市" }, { name: "乐清市" }, { name: "龙港市" }] }
    ]
  },
  {
    name: "江苏",
    children: [
      { name: "南京", children: [{ name: "玄武区" }, { name: "秦淮区" }, { name: "建邺区" }, { name: "鼓楼区" }, { name: "浦口区" }, { name: "栖霞区" }, { name: "雨花台区" }, { name: "江宁区" }, { name: "六合区" }, { name: "溧水区" }, { name: "高淳区" }] },
      { name: "苏州", children: [{ name: "姑苏区" }, { name: "虎丘区" }, { name: "吴中区" }, { name: "相城区" }, { name: "吴江区" }, { name: "常熟市" }, { name: "张家港市" }, { name: "昆山市" }, { name: "太仓市" }] },
      { name: "无锡", children: [{ name: "锡山区" }, { name: "惠山区" }, { name: "滨湖区" }, { name: "梁溪区" }, { name: "新吴区" }, { name: "江阴市" }, { name: "宜兴市" }] }
    ]
  },
  {
    name: "四川",
    children: [
      { name: "成都", children: [{ name: "锦江区" }, { name: "青羊区" }, { name: "金牛区" }, { name: "武侯区" }, { name: "成华区" }, { name: "龙泉驿区" }, { name: "青白江区" }, { name: "新都区" }, { name: "温江区" }, { name: "双流区" }, { name: "郫都区" }, { name: "新津区" }, { name: "金堂县" }, { name: "大邑县" }, { name: "蒲江县" }, { name: "都江堰市" }, { name: "彭州市" }, { name: "邛崃市" }, { name: "崇州市" }, { name: "简阳市" }] }
    ]
  }
];
