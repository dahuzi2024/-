
import { PhaseType, KeywordWeight } from './types';
import { Compass, Zap, Anchor } from 'lucide-react';

export const INTRO_TEXT = `
**注意力危机不是“分心”，而是“碎裂”。**

在算法推荐和短内容的轰炸下，我们的注意力不再是连续的河流，而是成了无数互不关联的闪光点。
**请在下方终端输入你的感受，系统将为你诊断。**
`;

// Keywords database for local NLP analysis
export const KEYWORDS_DB: KeywordWeight[] = [
  // Velocity (Speed/Anxiety) - High Score = High Speed/Anxiety
  { word: "急", dimension: PhaseType.Velocity, score: 20 },
  { word: "忙", dimension: PhaseType.Velocity, score: 15 },
  { word: "焦虑", dimension: PhaseType.Velocity, score: 25 },
  { word: "慌", dimension: PhaseType.Velocity, score: 20 },
  { word: "快", dimension: PhaseType.Velocity, score: 10 },
  { word: "没时间", dimension: PhaseType.Velocity, score: 20 },
  { word: "停不下来", dimension: PhaseType.Velocity, score: 25 },
  { word: "乱", dimension: PhaseType.Velocity, score: 15 },
  { word: "烦", dimension: PhaseType.Velocity, score: 10 },
  { word: "刷", dimension: PhaseType.Velocity, score: 15 }, // Scrolling
  { word: "失眠", dimension: PhaseType.Velocity, score: 15 },
  { word: "压力", dimension: PhaseType.Velocity, score: 15 },
  { word: "内耗", dimension: PhaseType.Velocity, score: 20 },
  
  // Low Velocity words (Stagnation)
  { word: "没劲", dimension: PhaseType.Velocity, score: -15 },
  { word: "无聊", dimension: PhaseType.Velocity, score: -10 },
  { word: "懒", dimension: PhaseType.Velocity, score: -15 },
  { word: "拖延", dimension: PhaseType.Velocity, score: -10 },
  { word: "提不起", dimension: PhaseType.Velocity, score: -20 },
  { word: "抑郁", dimension: PhaseType.Velocity, score: -25 },
  { word: "不想动", dimension: PhaseType.Velocity, score: -15 },

  // Trajectory (Direction/Meaning) - High Score = Clear Direction
  { word: "目标", dimension: PhaseType.Trajectory, score: 20 },
  { word: "梦想", dimension: PhaseType.Trajectory, score: 20 },
  { word: "计划", dimension: PhaseType.Trajectory, score: 15 },
  { word: "清楚", dimension: PhaseType.Trajectory, score: 15 },
  { word: "知道", dimension: PhaseType.Trajectory, score: 10 },
  { word: "奔头", dimension: PhaseType.Trajectory, score: 25 },
  { word: "决心", dimension: PhaseType.Trajectory, score: 20 },
  { word: "意义", dimension: PhaseType.Trajectory, score: 15 },
  
  // Low Trajectory words (Lost)
  { word: "迷茫", dimension: PhaseType.Trajectory, score: -25 },
  { word: "不知道", dimension: PhaseType.Trajectory, score: -20 },
  { word: "空白", dimension: PhaseType.Trajectory, score: -20 },
  { word: "随便", dimension: PhaseType.Trajectory, score: -15 },
  { word: "混", dimension: PhaseType.Trajectory, score: -20 },
  { word: "为了什么", dimension: PhaseType.Trajectory, score: -15 },
  { word: "没方向", dimension: PhaseType.Trajectory, score: -25 },

  // Viscosity (Depth/Connection) - High Score = High Depth
  { word: "沉浸", dimension: PhaseType.Viscosity, score: 20 },
  { word: "专注", dimension: PhaseType.Viscosity, score: 20 },
  { word: "深刻", dimension: PhaseType.Viscosity, score: 15 },
  { word: "扎实", dimension: PhaseType.Viscosity, score: 15 },
  { word: "朋友", dimension: PhaseType.Viscosity, score: 10 }, // Relationship
  { word: "坚持", dimension: PhaseType.Viscosity, score: 15 },
  { word: "故事", dimension: PhaseType.Viscosity, score: 10 },
  { word: "积累", dimension: PhaseType.Viscosity, score: 15 },
  { word: "难", dimension: PhaseType.Viscosity, score: 10 }, // Resistance creates viscosity
  { word: "痛苦", dimension: PhaseType.Viscosity, score: 5 }, // Suffering can create depth if processed
  
  // Low Viscosity words (Floating)
  { word: "空虚", dimension: PhaseType.Viscosity, score: -25 },
  { word: "浮躁", dimension: PhaseType.Viscosity, score: -20 },
  { word: "飘", dimension: PhaseType.Viscosity, score: -20 },
  { word: "浅", dimension: PhaseType.Viscosity, score: -15 },
  { word: "忘", dimension: PhaseType.Viscosity, score: -15 },
  { word: "孤独", dimension: PhaseType.Viscosity, score: -15 }, // Lack of connection
  { word: "没意思", dimension: PhaseType.Viscosity, score: -15 }
];

export const QUIZ_QUESTIONS = [
  // Trajectory (方向感)
  {
    id: 1,
    dimension: PhaseType.Trajectory,
    question: "想到未来一年，你的感觉是？",
    options: [
      { text: "一片空白，过一天算一天", score: 10 },
      { text: "有个大概方向，但经常变", score: 50 },
      { text: "很清晰，知道自己在往哪走", score: 90 }
    ]
  },
  {
    id: 2,
    dimension: PhaseType.Trajectory,
    question: "最近遇到困难或冲突时，你的第一反应是？",
    options: [
      { text: "立刻放弃，换个容易的", score: 10 },
      { text: "纠结很久，不知道咋办", score: 40 },
      { text: "这是必经之路，扛过去", score: 90 }
    ]
  },
  {
    id: 3,
    dimension: PhaseType.Trajectory,
    question: "你觉得自己每天做的事有连续性吗？",
    options: [
      { text: "完全没有，东一榔头西一棒槌", score: 10 },
      { text: "工作上还行，生活上一团糟", score: 50 },
      { text: "有，都在为一个大目标铺路", score: 90 }
    ]
  },
  {
    id: 4,
    dimension: PhaseType.Trajectory,
    question: "如果有两个选择：A.确定的安稳 B.未知的冒险，你通常？",
    options: [
      { text: "永远选 A，怕变动", score: 20 },
      { text: "看心情，偶尔想试试 B", score: 60 },
      { text: "倾向 B，我想看看不一样的", score: 90 } // 差异产生轨迹
    ]
  },

  // Velocity (焦虑/节奏) - 注意：高分代表高速度（高焦虑/忙碌）
  {
    id: 5,
    dimension: PhaseType.Velocity,
    question: "你刷短视频或看社交媒体的状态是？",
    options: [
      { text: "基本不看，或者只看深度内容", score: 20 },
      { text: "有时候会刷，能控制住", score: 50 },
      { text: "一刷就停不下来，脑子嗡嗡的", score: 95 }
    ]
  },
  {
    id: 6,
    dimension: PhaseType.Velocity,
    question: "如果在等车时有 3 分钟空闲，你会？",
    options: [
      { text: "发呆，观察周围环境", score: 10 },
      { text: "想点事情", score: 40 },
      { text: "立刻掏出手机刷两下", score: 90 }
    ]
  },
  {
    id: 7,
    dimension: PhaseType.Velocity,
    question: "最近心里的感觉是？",
    options: [
      { text: "太闲了，没劲", score: 10 }, // 低速度 = 停滞
      { text: "有张有弛，节奏刚好", score: 50 },
      { text: "急！总觉得时间不够用", score: 90 }
    ]
  },
  {
    id: 8,
    dimension: PhaseType.Velocity,
    question: "工作或学习时，被打断了会怎样？",
    options: [
      { text: "很淡定，接着做", score: 30 },
      { text: "有点烦，但能接上", score: 60 },
      { text: "暴躁！很难再进入状态", score: 90 }
    ]
  },

  // Viscosity (粘性/深度)
  {
    id: 9,
    dimension: PhaseType.Viscosity,
    question: "读长篇小说或深度文章时，你能读进去吗？",
    options: [
      { text: "完全不行，超过 1000 字就关掉", score: 10 },
      { text: "硬着头皮能看一些", score: 50 },
      { text: "很享受，能沉浸好几个小时", score: 90 }
    ]
  },
  {
    id: 10,
    dimension: PhaseType.Viscosity,
    question: "关于人际关系，你觉得？",
    options: [
      { text: "大部分是点赞之交，很轻松", score: 20 },
      { text: "有几个能说话的朋友", score: 60 },
      { text: "有那种能一起扛事儿的“过命”交情", score: 95 }
    ]
  },
  {
    id: 11,
    dimension: PhaseType.Viscosity,
    question: "遇到痛苦或挫折，你通常？",
    options: [
      { text: "立刻找快乐的事转移注意力", score: 10 },
      { text: "忍一忍就过去了", score: 50 },
      { text: "会去想为什么痛苦，并从中学习", score: 90 } // 阻抗产生粘性
    ]
  },
  {
    id: 12,
    dimension: PhaseType.Viscosity,
    question: "你觉得自己是个“有故事”的人吗？",
    options: [
      { text: "没啥故事，感觉每天都一样", score: 20 },
      { text: "有一些经历片段", score: 50 },
      { text: "是的，我的经历连成了一条线", score: 90 }
    ]
  }
];

export const SECTIONS = [
  {
    id: 'trajectory',
    title: '轨迹 (奔头)',
    subtitle: '意义的方向感',
    icon: Compass,
    color: 'text-blue-500',
    phase: PhaseType.Trajectory,
    summary: `别谈什么大目标。轨迹就是你心里那股“想往那边去”的劲儿。没了它，人就是原地打转。`,
    content: `
### 1. 啥是轨迹？就是心里的“奔头”
一个生命有没有方向，不是看你立了多少 Flag，而是看你是不是被什么东西**吸引**着。
方向不是你坐在屋里想出来的，是你被世界上的某个东西（一个兴趣、一个人、一个难题）**勾住**了。
*   **别光想，去撞：** 轨迹不是规划出来的，是撞出来的。
*   **不是直线：** 人生本来就是弯弯绕绕的，只要那股劲儿没断，弯路也是路。

### 2. 为什么现在人觉得没奔头？
因为日子被过平了，也被切碎了。
*   **太舒服了：** 天天躺平，没有冲突，没有困难，哪来的方向？方向是在解决麻烦中长出来的。
*   **切太碎了：** 刚想干点正事，手机响了。注意力一断，方向感就断了。

#### 🛠️ 怎么找回奔头？
*   **找点麻烦：** 别总躲着困难走。去解决一个具体的难题，方向自然就出来了。
*   **拉长时间：** 试着做一件需要一个月才能看到结果的事，别总想立刻爽。
`
  },
  {
    id: 'velocity',
    title: '速度 (节奏)',
    subtitle: '心里的急躁程度',
    icon: Zap,
    color: 'text-red-500',
    phase: PhaseType.Velocity,
    summary: `速度不是指你跑得快，是指你心里急不急。现在的危机是：大家都在空转，心里慌得一比。`,
    content: `
### 1. 速度快不一定是好事
在意义工程里，速度就是**频率**。
*   **太快（焦虑）：** 就像发动机转速到了红线，车却没动。脑子嗡嗡的，全是事，但啥也没干成。
*   **太慢（抑郁）：** 发动机熄火了。对啥都提不起劲，世界是灰色的。
*   **刚刚好（心流）：** 这种感觉就是——你忘了时间。

### 2. 为什么我们会“碎裂”？
这是最可怕的状态：**快而碎**。
你的注意力像个跳蚤，从这个视频跳到那个新闻，从微信跳到小红书。
**每一次跳跃，都是一次“短路”。** 能量全在切换中损耗了，最后留下的只有疲惫和空虚。

#### 🛠️ 怎么调节奏？
*   **少切换：** 强迫自己一次只做一件事。哪怕是发呆，也专心发呆。
*   **物理降温：** 觉得慌的时候，别玩手机。去听白噪声（心流舱），强制把脑子的转速降下来。
`
  },
  {
    id: 'viscosity',
    title: '粘性 (扎实)',
    subtitle: '活着的重量感',
    icon: Anchor,
    color: 'text-amber-500',
    phase: PhaseType.Viscosity,
    summary: `在这个飘忽的年代，粘性就是你的“锚”。能不能沉下心，能不能扛住事，全看粘性。`,
    content: `
### 1. 为什么感觉“心里空落落的”？
因为**没粘性**。
粘性是怎么来的？是**扛**出来的。
*   太轻松的关系，没粘性。
*   太容易得到的信息，没粘性。
*   太简单的快乐，没粘性。
没有阻力，就没有重量。没有重量，人就飘在半空，当然空虚。

### 2. 现代人的通病：漂浮
我们好像活了很多瞬间，但连不成一个故事。
朋友很多，但能借钱的没有。
知识很多，但能解决问题的没有。
这就是**低粘性**。

#### 🛠️ 怎么让自己扎实起来？
*   **自找苦吃：** 主动去读难懂的书，去学难学的技能，去维持一段麻烦的关系。
*   **攒故事：** 别光过日子，要把日子过成故事。多回味，多记录，把碎片粘起来。
`
  }
];

export const DIAGNOSTICS: Record<string, string> = {
  fragmented: "严重警告：你碎了 (碎裂危机)",
  balanced: "状态极佳：心流大师 (FLOW)",
  burnout: "警告：快把自己烧干了 (燃尽)",
  high_vel_low_visc: "症状：极度焦虑/瞎忙 (空转)",
  high_traj_low_visc: "症状：眼高手低 (漂浮)",
  low_traj_low_vel: "症状：躺平/没劲 (停滞)",
  high_visc_low_vel: "症状：老古董/因循守旧 (惯性)",
  nihilism: "严重警告：行尸走肉 (虚无)",
  unstable: "等待输入：请输入你的状态"
};

export const SOLUTIONS: Record<string, string> = {
  fragmented: `
**你的注意力已经变成了粉末。**
脑子转得飞快（高速度），但没深度（低粘性），也没方向（低奔头）。
**【马上自救】**
1. **立刻断网**：你需要物理隔离。
2. **强制重启**：点击下方按钮，进入【心流舱】，什么都别想，听 5 分钟红噪声。`,
  
  balanced: `
**牛！你的状态让很多人羡慕。**
你有奔头，能沉住气，节奏也稳。
**【保持住】**
你是这个时代的稀缺物种。累的时候听听粉噪声维持状态即可。`,

  burnout: `
**你的油箱已经空了。**
你太想赢了（高奔头），也太急了（高速度），但身体跟不上了（低粘性）。
**【马上自救】**
**必须刹车**：别再加任务了。今晚早睡，或者听听深沉的红噪声（Brown Noise）给自己加点重力。`,

  high_vel_low_visc: `
**你现在像个无头苍蝇。**
整天忙忙叨叨（高速度），但心里没底（低粘性）。焦虑就是这么来的。
**【马上自救】**
**慢下来**：焦虑是因为你太快了。你需要做一件慢动作的事：手冲咖啡、练字、或者听白噪声冥想。`,

  high_traj_low_visc: `
**想得挺美，做得太少。**
方向感很强（高奔头），但沉不下去（低粘性）。容易变成空想家。
**【马上自救】**
**干脏活**：别光想战略，去干一件具体的、枯燥的小事。把它干完。`,

  low_traj_low_vel: `
**你的发动机熄火了。**
没奔头，也没劲。这可能是抑郁的前兆。
**【马上自救】**
**随便动动**：别想什么大意义。先动起来，下楼跑个圈，或者听点激昂的音乐。`,

  high_visc_low_vel: `
**你陷在泥里了。**
底子很厚（高粘性），但太慢了，甚至有点固执。
**【马上自救】**
**看点新鲜的**：你需要刺激。去接触一个全新的领域，或者见一个新朋友。`,

  nihilism: `
**你的精神世界正在坍塌。**
没方向，没动力，没感觉。
**【马上自救】**
**回归生存**：别想哲学问题了。吃顿好的，洗个热水澡，感受肉体的存在。`,
  
  unstable: `在上方输入你的感受，AI 终端将自动分析你的精神参数。`
};
