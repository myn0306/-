import { useState } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

// ─── DATA ────────────────────────────────────────────────────────────────────

const L1_FACTORS = [
  {
    id: "vision", label: "ビジョンの求心力", color: "#c084fc", ref: 4.2,
    questions: [
      { id: "v1", axis: "認知・思想", text: "自分のビジョンを誰かに話したとき、相手が実際に動いたことがあるか。それとも「すごいね」で終わることが多いか" },
      { id: "v2", axis: "判断", text: "どちらが得か分かっている選択肢を前にしたとき、「でもこれは自分の向かう方向か？」を先に問うか" },
      { id: "v3", axis: "素質", text: "何もうまくいかない時期でも、「なぜやるか」が自分の中からにじみ出てくるか" },
    ],
    high: "判断の軸がビジョンに根付いている傾向があります。次のステップは、そのビジョンを届ける「言葉の設計」かもしれません。話すたびに相手の反応を観察し、どの言葉が人を動かすかを蓄積していくことで、求心力がさらに育つことがあります。",
    mid: "ビジョンはあるものの、迷ったとき損得が先に来る場面があるかもしれません。「なぜやるか」を1〜2文で書いておき、意思決定の前に読み返す習慣が、判断のブレを減らすことがあります。",
    low: "ビジョンの求心力は、まず「自分がなぜこれをやるのか」を言葉にするところから育ちます。今の仕事や活動に対して「これは誰のため、何のためか」を書き出してみることが、最初の一歩になることがあります。",
  },
  {
    id: "accept", label: "他者受容力", color: "#34d399", ref: 3.8,
    questions: [
      { id: "a1", axis: "認知・思想", text: "相手が自分の「当たり前」をしていないとき、まず「なんでしないの？」と思うか、「自分の当たり前が違うのかも」と思うか" },
      { id: "a2", axis: "判断", text: "部下や同僚が自分なら絶対しない選択をしたとき、最初に来るのは批判か、「この人なりの理由があるかも」という好奇心か" },
      { id: "a3", axis: "素質", text: "自分とは全く違う生き方・働き方をしている人に会ったとき、自然と「そういう人もいるな」と受け取れているか" },
    ],
    high: "他者の文脈で物事を見る土台が育っています。この力を活かすなら、チームや交渉の場で「相手はなぜこう動くのか」を言語化してみることで、関係性の設計がより精緻になることがあります。",
    mid: "受容できる場面とできない場面がある場合、「自分がイラッとした瞬間」を記録してみることが参考になることがあります。パターンが見えてくると、どこで自分の基準が出ているかが分かるようになることがあります。",
    low: "他者受容は「好きになること」ではなく「違う設計で動いている人だ」と事実として見ることです。「なぜこの人はこう選ぶのだろう」という問いを、批判の前に一度はさむ練習が、第一歩になることがあります。",
  },
  {
    id: "resp", label: "自責・責任感", color: "#fbbf24", ref: 4.5,
    questions: [
      { id: "r1", axis: "認知・思想", text: "何かミスをしたとき、まず「どう謝るか」を考えるか、「次にどう変えるか」を考えるか" },
      { id: "r2", axis: "判断", text: "プロジェクトが失敗したとき、最初に「誰が悪かったか」を考えるか、「自分に何ができたか」を考えるか" },
      { id: "r3", axis: "素質", text: "限界まで追い詰められたとき、誰かのせいにしたい気持ちが湧いても、最終的に「自分にできることは何か」に戻ってこられるか" },
    ],
    high: "責任を「次を変える力」として使えている傾向があります。注意点があるとすれば、自責が強すぎると消耗に向かうことがあります。「自分にできたことは何か」と同時に「自分ではどうにもならなかったことは何か」を分けて見る習慣が、長期的な持続力を支えることがあります。",
    mid: "自責の姿勢は持っているものの、追い詰められると外に向きやすい場面があるかもしれません。そのとき「今、外に向いているな」と気づくだけで、引き戻す力が育ちます。責めるのではなく、観察するだけでいいことがあります。",
    low: "自責と責任感は、謝るスキルではなく「次の行動を変えるスキル」です。何か問題が起きたとき「自分に何が変えられたか」を1つだけ書き出す習慣が、この力の入口になることがあります。",
  },
  {
    id: "uncert", label: "不確実性への態度", color: "#60a5fa", ref: 4.3,
    questions: [
      { id: "u1", axis: "認知・思想", text: "答えが出ない問題に直面したとき、まず「不安・焦り」が来るか、まず「どうすれば分かるか」が来るか" },
      { id: "u2", axis: "判断", text: "情報が足りない状態で決断を迫られたとき、「もっと情報が欲しい」と止まるか、「今ある情報で動くべきか」を自分で判断できるか" },
      { id: "u3", axis: "素質", text: "誰も正解を知らないテーマに取り組むとき、しんどさより先に「面白い」という感覚が自然に来ることがあるか" },
    ],
    high: "わからない状況をエネルギーに変える素地があります。さらに活かすなら、その「面白い」という感覚を言語化してチームに伝えることで、周囲の不安を和らげるリーダーとしての存在感が高まることがあります。",
    mid: "不安が先に来る場面があるかもしれません。そのとき「今、何がわかっていて、何がわかっていないか」を紙に書き出すことが、不確実性を扱いやすくすることがあります。頭の中にあるものを外に出すだけで、視野が変わることがあります。",
    low: "不確実な状況への耐性は、小さな「わからないままやってみた」体験の積み重ねで育ちます。答えが出ていない問いに、まず0.1歩動いてみる練習が、この力の土台になることがあります。",
  },
  {
    id: "decide", label: "意思決定の質と速度", color: "#fb7185", ref: 4.0,
    questions: [
      { id: "d1", axis: "認知・思想", text: "「まだ決めなくていい」と先送りにしたとき、その先送り自体にコストがかかっていると感じるか" },
      { id: "d2", axis: "判断", text: "選択肢を前に迷ったとき、「どれが正解か」を探すか、「どれが後から直しやすいか」を基準にするか" },
      { id: "d3", axis: "素質", text: "誰にも相談できない状況で決断を迫られたとき、自分の中に「決める根拠」が残っているか" },
    ],
    high: "「修正しやすさ」を基準に決断できている傾向があります。この力をさらに磨くなら、決断した後に「なぜそう決めたか」を短く記録しておくことで、自分の判断パターンの解像度が上がることがあります。",
    mid: "迷ったとき「正解を探す」に入ってしまう場面があるかもしれません。「1ヶ月後に振り返ったとき、どちらを選んでいた方が後悔が少ないか」という問いが、決断を動かすことがあります。",
    low: "意思決定の速度は、「決めること」より「先送りのコストを感じること」から育ちます。今日先送りにしていることを1つ書き出し、「これを1週間放置したら何が起きるか」を考えてみることが、入口になることがあります。",
  },
  {
    id: "init", label: "主体性", color: "#e879f9", ref: 4.4,
    questions: [
      { id: "i1", axis: "認知・思想", text: "やりたくない仕事をしているとき、「やらされている」と感じるか、「自分がここにいることを選んでいる」と感じるか" },
      { id: "i2", axis: "判断", text: "誰も頼んでいないことに気づいたとき、「誰かが言うまで待とう」と思うか、「自分がやるべきだから動こう」と思うか" },
      { id: "i3", axis: "素質", text: "誰も見ていない・評価されない場面でも、同じ質で動いている自分が自然にいるか" },
    ],
    high: "誰も見ていない場面でも同じ質で動ける土台があります。この力は、チームへの信頼感の源になります。次のステップは、その姿勢を意図的に見せることで、周囲の主体性を引き出す設計に使えることがあります。",
    mid: "許可や環境に左右される場面があるかもしれません。「もし自分がこの場のオーナーだったら、どう動くか」という問いを、動く前に一度はさむことで、主体性の筋肉が育つことがあります。",
    low: "主体性は「やる気」ではなく「自分が選んでいる感覚」です。今の仕事を「やらされている」と感じる場合、「自分がここにいることを選んでいる理由」を1つ言語化してみることが、感覚を変えるきっかけになることがあります。",
  },
];

const L2_DOMAINS = [
  {
    id: "self", label: "自己軸", color: "#818cf8",
    factors: [
      {
        id: "selfaware", label: "自己認識の解像度", ref: 4.0,
        questions: [
          { id: "sa1", axis: "認知・思想", text: "自分の強みを人に説明するとき、「なんとなく得意」ではなく具体的な場面を挙げて話せるか" },
          { id: "sa2", axis: "判断", text: "ムカッとしたり不安になったとき、「感情で動いているな」と気づいてブレーキをかけられるか" },
          { id: "sa3", axis: "素質", text: "褒められたときと批判されたとき、どちらも同じ落ち着きで受け取れているか。片方に大きく揺れないか" },
        ],
        high: "自分の強みと弱みを場面と紐づけて把握できている傾向があります。さらに活かすなら、年に一度「自分の認知のクセ」を書き直す習慣が、アップデートの機会になることがあります。",
        mid: "感情が強い場面では判断の識別が難しくなることがあるかもしれません。「今、感情が動いているな」と気づいたとき、重要な決断を24時間後に先延ばしにするルールを持つことが、判断の質を守ることがあります。",
        low: "自己認識は「自分はこういう人間だ」という固定ではなく、「こういう場面でこう動く傾向がある」という観察から育ちます。1週間の行動を振り返り、「どんな場面で力が出たか」「どんな場面で止まったか」を書き出してみることが入口になることがあります。",
      },
      {
        id: "solitude", label: "孤独な決断に耐える力", ref: 3.9,
        questions: [
          { id: "so1", axis: "認知・思想", text: "リーダーが感じる孤独は、誰かに解消してもらうものではなく、自分で引き受けるものだと思っているか" },
          { id: "so2", axis: "判断", text: "「正解を誰も知らない」局面に立ったとき、それでも「自分が決める」と腹をくくって動けるか" },
          { id: "so3", axis: "素質", text: "袋小路に追い詰められたとき、誰かに答えを求めたくなる前に、まず自分の内側を見る癖があるか" },
        ],
        high: "孤独を引き受ける覚悟が育っています。この力を維持するために、定期的に「自分の判断基準」を言語化しておくことが、孤独な局面での軸を守ることがあります。",
        mid: "誰かに確認したくなる場面があるかもしれません。それ自体は問題ではなく、「確認したい理由が不安なのか、情報不足なのか」を区別できるようになることが、孤独な決断の質を高めることがあります。",
        low: "孤独な決断に耐える力は、小さな「誰にも相談せずに決めた」体験から育ちます。日常の些細な選択（どこで食べるか、何を先にやるか）を意識的に自分で決め切る練習が、基礎になることがあります。",
      },
      {
        id: "selfmgmt", label: "セルフマネジメント力", ref: 3.8,
        questions: [
          { id: "sm1", axis: "認知・思想", text: "自分のパフォーマンスが下がる条件（疲れ・特定の人・環境など）を具体的に把握しているか" },
          { id: "sm2", axis: "判断", text: "消耗しているとき、「とにかく動かないと」と無理するか、「立て直してから動く」と判断できるか" },
          { id: "sm3", axis: "素質", text: "自分の判断が「いつもと違う気がする」と感じる瞬間に、自然と気づけるか" },
        ],
        high: "自分のコンディション管理の基盤があります。さらに精度を上げるなら、「パフォーマンスが高かった日・低かった日」を記録し、共通点を探すことで、自分の最適条件が明確になることがあります。",
        mid: "消耗しているときの判断が難しい場面があるかもしれません。「いつもと違う気がする」と感じたとき、重要な決断を翌日に持ち越すルールを設けることが、判断の質を守ることがあります。",
        low: "セルフマネジメントは自制心ではなく「自分の取扱説明書」を作ることです。「どんな状態のときに一番動けるか」「何があると急に止まるか」を言語化してみることが、最初の一歩になることがあります。",
      },
    ],
  },
  {
    id: "others", label: "他者軸", color: "#2dd4bf",
    factors: [
      {
        id: "trans", label: "翻訳・発信力", ref: 4.2,
        questions: [
          { id: "t1", axis: "認知・思想", text: "話が伝わらなかったとき、「相手が理解していない」と思うか、「自分の伝え方が足りなかった」と思うか" },
          { id: "t2", axis: "判断", text: "話す相手が変わったとき（経営者・現場・学生など）、言葉の深さや順番を自然に変えられているか" },
          { id: "t3", axis: "素質", text: "難しい話をするとき、「できるだけ簡単に伝えたい」という欲求が自然に出てくるか" },
        ],
        high: "相手に合わせて言葉を変える感覚が育っています。次のステップは、その翻訳を意図的に「外部への発信」として積み上げることで、信頼と影響力の資産になることがあります。",
        mid: "相手によって伝わり方が変わることがあるかもしれません。「伝わらなかった」と感じたとき、「相手に何が届いたか」を確認する習慣が、翻訳の精度を上げることがあります。",
        low: "翻訳力は「相手が何を知っていて、何を知らないか」を想像することから育ちます。次に何かを説明するとき、「この人は何を前提に持っているか」を一度考えてから話し始める練習が、入口になることがあります。",
      },
      {
        id: "orgdes", label: "組織設計力", ref: 3.9,
        questions: [
          { id: "og1", axis: "認知・思想", text: "チームで同じ問題が繰り返されるとき、「人の問題」より「仕組みの問題」だと先に考えるか" },
          { id: "og2", axis: "判断", text: "メンバーがうまく動けていないとき、その人を変えようとするより先に、環境や役割の設計を見直すか" },
          { id: "og3", axis: "素質", text: "感情的に消耗していても、「この問題の構造はどうなっているか」という問いが自然に浮かぶか" },
        ],
        high: "組織を「構造」として観察できている傾向があります。この力を活かすなら、問題が起きたとき「この構造でこうなることは予測できたか」を振り返ることで、事前設計の精度が上がることがあります。",
        mid: "感情が強い場面では人への帰因が先に来ることがあるかもしれません。「もしこの人が違う環境・役割にいたら、同じ行動をするか」という問いが、構造視点への切り替えスイッチになることがあります。",
        low: "組織設計力は、「人を変えようとして失敗した経験」から育つことがあります。今チームで繰り返されている問題を1つ選び、「仕組みで防げるとしたらどうするか」を考えてみることが、最初の一歩になることがあります。",
      },
      {
        id: "people", label: "人を見抜く力", ref: 3.7,
        questions: [
          { id: "pe1", axis: "認知・思想", text: "人の本質は話す内容より、どんな場面でどう選択するか・どう反応するかに出ると思っているか" },
          { id: "pe2", axis: "判断", text: "初めて会う人と話すとき、「何をしている人か」より「何を動機に動いている人か」を先に知りたいと思うか" },
          { id: "pe3", axis: "素質", text: "短い接触の中で、「この人は信頼できる/できない」という感覚が自然に湧いてくるか" },
        ],
        high: "人の本質を言葉より行動で見る視点があります。この力をさらに磨くなら、「最初の感覚」と「後から分かった事実」を記録しておくことで、自分の直感の精度が分かるようになることがあります。",
        mid: "動機まで読み取るには時間がかかることがあるかもしれません。初対面の人と会った後、「この人はどんな動機で動いていると思うか」を短くメモしておく習慣が、観察眼を育てることがあります。",
        low: "人を見抜く力は、言葉ではなく「何を選ぶか・どんな場面でどう反応するか」への注目から育ちます。次に誰かと話すとき、「この人は何に反応が強かったか」を観察してみることが、入口になることがあります。",
      },
    ],
  },
  {
    id: "market", label: "市場軸", color: "#fb923c",
    factors: [
      {
        id: "roi", label: "ROIの言語化力", ref: 3.8,
        questions: [
          { id: "ro1", axis: "認知・思想", text: "自分がやっていることの価値を、相手が納得できる言葉や数字で説明できると思っているか" },
          { id: "ro2", axis: "判断", text: "「なぜこれをやるのか」を聞かれたとき、熱量や思いではなく、論理と根拠で答えられるか" },
          { id: "ro3", axis: "素質", text: "何かを始めようとするとき、「これは何を生み出すか」という問いが自然に頭に浮かぶか" },
        ],
        high: "価値を数字と論理で伝える力が育っています。さらに使うなら、提案の前に「この投資で相手は何を得るか」を3つ書き出す習慣が、説得力をさらに高めることがあります。",
        mid: "価値の感覚はあるものの、数字への変換が難しい場面があるかもしれません。「この活動で何が変わったか」を数値以外でも「時間・手間・リスク」で言語化する練習が、翻訳の幅を広げることがあります。",
        low: "ROIの言語化は、「相手は何に投資しているか」を理解することから始まります。次に何かを提案するとき、「相手の視点からのメリット」を先に考えてから話す練習が、入口になることがあります。",
      },
      {
        id: "mkt", label: "市場感覚", ref: 3.9,
        questions: [
          { id: "mk1", axis: "認知・思想", text: "同じものでも、タイミングがずれると全く刺さらないことがある、と体感として分かっているか" },
          { id: "mk2", axis: "判断", text: "「今動くべきか、待つべきか」を判断するとき、焦りや不安より環境の変化を読んで決めているか" },
          { id: "mk3", axis: "素質", text: "世の中のニュースや動きを見ているとき、「次にこうなりそう」という予感が自然に浮かぶことがあるか" },
        ],
        high: "市場の動きをタイミングと結びつける感覚があります。この力を維持するために、「予感が当たった・外れた」を記録し、自分の感覚の精度を把握しておくことが、判断の質を守ることがあります。",
        mid: "焦りが判断に影響することがあるかもしれません。「今動きたい理由」を書き出したとき、「市場の変化」と「自分の焦り」のどちらが多いかを確認する習慣が、判断の質を上げることがあります。",
        low: "市場感覚は、日常のニュースや周囲の変化を「なぜこうなったか」と考える習慣から育ちます。1日1つ気になったニュースに対して「これは自分の仕事にどう関係するか」を考えてみることが、最初の一歩になることがあります。",
      },
      {
        id: "cross", label: "越境力", ref: 4.1,
        questions: [
          { id: "cr1", axis: "認知・思想", text: "専門外の領域を学ぶことが、自分の専門を深めることにつながると実感として分かっているか" },
          { id: "cr2", axis: "判断", text: "全く異なる分野の人と話すとき、「違いすぎて参考にならない」ではなく「何か使えるものがないか」と考えるか" },
          { id: "cr3", axis: "素質", text: "関係なさそうな話を聞いていても、「これ自分の仕事に使えないか」と自然に考えてしまうか" },
        ],
        high: "異分野への好奇心が専門を深めている傾向があります。さらに活かすなら、越境して得た学びを「自分の言葉で」チームや外部に発信することで、独自の視点が資産として蓄積されることがあります。",
        mid: "越境への意識はあるものの、自分の領域に引き戻る場面があるかもしれません。次に全く異なる分野の人と話すとき、「1つだけ自分の仕事に使えるものを探す」というミッションを持つことで、越境の質が変わることがあります。",
        low: "越境力は「全く違う世界の人と話す」ことから育ちます。今まで接点がなかった分野の人に会う機会を月1回作ってみることが、思考の幅を広げる入口になることがあります。",
      },
      {
        id: "fail", label: "失敗の体系化力", ref: 4.0,
        questions: [
          { id: "fa1", axis: "認知・思想", text: "失敗は隠したり忘れたりするものではなく、言語化して誰かに渡せる資産だと思っているか" },
          { id: "fa2", axis: "判断", text: "うまくいかなかったとき、気持ちの整理で終わらせず「なぜそうなったか」の構造まで考えられているか" },
          { id: "fa3", axis: "素質", text: "自分が深く傷ついた経験でも、時間が経てば「これを誰かのために使いたい」と思える瞬間が来るか" },
        ],
        high: "失敗を「渡せる資産」として捉える視点があります。さらに活かすなら、失敗の記録を定期的に読み返し「当時気づかなかったパターン」を見つけることで、体系化の精度が上がることがあります。",
        mid: "感情の整理で終わってしまう場面があるかもしれません。うまくいかなかったとき、「何が原因だったか」を自分・相手・環境の3つに分けて考える習慣が、構造まで掘り下げる力を育てることがあります。",
        low: "失敗の体系化は「失敗を言語化すること」から始まります。最近うまくいかなかった1つの出来事に対して、「何が起きたか・なぜそうなったか・次に変えられることは何か」を書き出してみることが、入口になることがあります。",
      },
    ],
  },
];

const ALL_L1_QS = L1_FACTORS.flatMap(f => f.questions.map(q => q.id));
const ALL_L2_QS = L2_DOMAINS.flatMap(d => d.factors.flatMap(f => f.questions.map(q => q.id)));
const ALL_QS = [...ALL_L1_QS, ...ALL_L2_QS];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const avg = (ids, scores) => {
  const vals = ids.map(id => scores[id] || 0).filter(v => v > 0);
  return vals.length ? parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)) : 0;
};

const getComment = (factor, score) => {
  if (score === 0) return "";
  if (score >= 4) return factor.high;
  if (score >= 2.5) return factor.mid;
  return factor.low;
};

const tierLabel = (score) => {
  if (score === 0) return { label: "未回答", color: "#4b5563" };
  if (score >= 4) return { label: "自然に滲み出ている領域", color: "#34d399" };
  if (score >= 2.5) return { label: "状況によって変わる領域", color: "#fbbf24" };
  return { label: "意識することで広がる領域", color: "#fb7185" };
};

const SCORE_LABELS = ["", "ほとんど当てはまらない", "あまり当てはまらない", "どちらともいえない", "だいたい当てはまる", "強く当てはまる"];

// ─── STYLES ──────────────────────────────────────────────────────────────────

const S = {
  page: { minHeight: "100vh", background: "linear-gradient(160deg, #0a0a14 0%, #0f0f1e 60%, #0a1410 100%)", fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif", color: "#e2e8f0", padding: "24px 16px" },
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px" },
  btn: (active, color = "#a78bfa") => ({ padding: "12px 0", borderRadius: 10, border: active ? `2px solid ${color}` : "1px solid rgba(255,255,255,0.1)", background: active ? `${color}20` : "rgba(255,255,255,0.02)", color: active ? color : "#6b7280", fontWeight: active ? 700 : 400, fontSize: 18, cursor: "pointer", transition: "all 0.15s", flex: 1 }),
  tag: (color) => ({ fontSize: 11, color, background: `${color}15`, border: `1px solid ${color}40`, borderRadius: 4, padding: "2px 8px", display: "inline-block" }),
  primary: { width: "100%", padding: "16px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #7c3aed, #a78bfa)", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" },
  ghost: { background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "#9ca3af", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontSize: 13 },
};

// ─── SUBCOMPONENTS ───────────────────────────────────────────────────────────

function ProgressBar({ answered, total }) {
  const pct = Math.round((answered / total) * 100);
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: "#6b7280" }}>{answered} / {total} 問回答済み</span>
        <span style={{ fontSize: 12, color: "#a78bfa" }}>{pct}%</span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 100, height: 3 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg,#7c3aed,#a78bfa)", borderRadius: 100, transition: "width 0.3s" }} />
      </div>
    </div>
  );
}

function QuestionBlock({ question, score, onScore, factorColor }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ marginBottom: 8 }}>{S.tag(factorColor) && <span style={S.tag(factorColor)}>{question.axis}</span>}</div>
      <p style={{ fontSize: 14, lineHeight: 1.8, color: "#d1d5db", marginBottom: 14 }}>{question.text}</p>
      <div style={{ display: "flex", gap: 8 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => onScore(question.id, n)} style={S.btn(score === n, factorColor)}>{n}</button>
        ))}
      </div>
      {score > 0 && <div style={{ fontSize: 11, color: "#6b7280", marginTop: 6, textAlign: "center" }}>{SCORE_LABELS[score]}</div>}
    </div>
  );
}

// ─── PHASE: INTRO ────────────────────────────────────────────────────────────

function IntroPhase({ onStart }) {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 40, paddingTop: 20 }}>
        <div style={{ fontSize: 11, color: "#a78bfa", letterSpacing: 3, marginBottom: 12 }}>LEADER DIAGNOSIS</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", lineHeight: 1.3, marginBottom: 12 }}>変革者の素質診断</h1>
        <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.8 }}>
          事業変革に携わってきたリーダーたちの思想・判断・素質を分析した傾向値と照らし合わせ、あなたの現在地を確認します
        </p>
      </div>

      <div style={{ ...S.card, marginBottom: 16, borderColor: "rgba(251,191,36,0.2)" }}>
        <p style={{ fontSize: 12, color: "#fbbf24", lineHeight: 1.8, margin: 0 }}>
          ⚠️ この結果は診断ではなく、自己理解のための参考情報です。回答時の状況や気持ちによって変わることがあります。専門的な判断の代わりになるものではありません。
        </p>
      </div>

      <div style={{ ...S.card, marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 12 }}>診断の構成</div>
        {[
          { level: "LEVEL 1", label: "コア素質", desc: "6因子 × 3問 = 18問", color: "#a78bfa" },
          { level: "LEVEL 2", label: "領域別深掘り", desc: "3領域 × 各因子 × 3問 = 30問", color: "#34d399" },
          { level: "LEVEL 3", label: "統合レポート", desc: "レーダーチャート + PDF出力", color: "#60a5fa" },
        ].map(item => (
          <div key={item.level} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ ...S.tag(item.color), minWidth: 60, textAlign: "center" }}>{item.level}</span>
            <div>
              <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{item.desc}</div>
            </div>
          </div>
        ))}
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          所要時間：約15〜20分
        </div>
      </div>

      <button onClick={onStart} style={S.primary}>診断を始める →</button>
      <div style={{ height: 40 }} />
    </div>
  );
}

// ─── PHASE: LEVEL 1 ──────────────────────────────────────────────────────────

function Level1Phase({ scores, setScore, onNext }) {
  const [factorIdx, setFactorIdx] = useState(0);
  const factor = L1_FACTORS[factorIdx];
  const factorAnswered = factor.questions.filter(q => scores[q.id] > 0).length;
  const totalAnswered = ALL_L1_QS.filter(id => scores[id] > 0).length;
  const allAnswered = factorAnswered === 3;
  const isLast = factorIdx === L1_FACTORS.length - 1;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: "#a78bfa", letterSpacing: 2, marginBottom: 4 }}>LEVEL 1 · コア素質</div>
        <ProgressBar answered={totalAnswered} total={18} />
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {L1_FACTORS.map((f, i) => (
          <div key={f.id} onClick={() => setFactorIdx(i)} style={{ flex: 1, height: 4, borderRadius: 100, background: i === factorIdx ? f.color : f.questions.every(q => scores[q.id] > 0) ? `${f.color}60` : "rgba(255,255,255,0.08)", cursor: "pointer", transition: "all 0.2s" }} />
        ))}
      </div>

      <div style={{ ...S.card, borderColor: `${factor.color}30`, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: factor.color, letterSpacing: 1, marginBottom: 4 }}>{factorIdx + 1} / {L1_FACTORS.length}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9" }}>{factor.label}</div>
          </div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>{factorAnswered}/3 回答</div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
          {factor.questions.map(q => (
            <QuestionBlock key={q.id} question={q} score={scores[q.id] || 0} onScore={setScore} factorColor={factor.color} />
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {factorIdx > 0 && <button onClick={() => setFactorIdx(factorIdx - 1)} style={S.ghost}>← 前へ</button>}
        {!isLast ? (
          <button onClick={() => setFactorIdx(factorIdx + 1)} disabled={!allAnswered} style={{ ...S.primary, opacity: allAnswered ? 1 : 0.4, cursor: allAnswered ? "pointer" : "not-allowed" }}>
            次の因子へ →
          </button>
        ) : (
          <button onClick={onNext} disabled={ALL_L1_QS.filter(id => scores[id] > 0).length < 18} style={{ ...S.primary, opacity: ALL_L1_QS.filter(id => scores[id] > 0).length < 18 ? 0.4 : 1 }}>
            LEVEL 2 へ進む →
          </button>
        )}
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}

// ─── PHASE: LEVEL 2 ──────────────────────────────────────────────────────────

function Level2Phase({ scores, setScore, onNext }) {
  const [domainIdx, setDomainIdx] = useState(0);
  const [factorIdx, setFactorIdx] = useState(0);
  const domain = L2_DOMAINS[domainIdx];
  const factor = domain.factors[factorIdx];
  const totalAnswered = ALL_L2_QS.filter(id => scores[id] > 0).length;
  const factorAnswered = factor.questions.filter(q => scores[q.id] > 0).length;
  const isLastFactor = factorIdx === domain.factors.length - 1;
  const isLastDomain = domainIdx === L2_DOMAINS.length - 1;
  const allDone = totalAnswered === 30;

  const goNext = () => {
    if (!isLastFactor) { setFactorIdx(factorIdx + 1); }
    else if (!isLastDomain) { setDomainIdx(domainIdx + 1); setFactorIdx(0); }
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: "#34d399", letterSpacing: 2, marginBottom: 4 }}>LEVEL 2 · 領域別深掘り</div>
        <ProgressBar answered={totalAnswered} total={30} />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {L2_DOMAINS.map((d, i) => (
          <button key={d.id} onClick={() => { setDomainIdx(i); setFactorIdx(0); }} style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: `1px solid ${i === domainIdx ? d.color : "rgba(255,255,255,0.08)"}`, background: i === domainIdx ? `${d.color}15` : "transparent", color: i === domainIdx ? d.color : "#6b7280", fontSize: 12, cursor: "pointer" }}>
            {d.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {domain.factors.map((f, i) => (
          <div key={f.id} onClick={() => setFactorIdx(i)} style={{ flex: 1, height: 4, borderRadius: 100, background: i === factorIdx ? domain.color : f.questions.every(q => scores[q.id] > 0) ? `${domain.color}50` : "rgba(255,255,255,0.08)", cursor: "pointer" }} />
        ))}
      </div>

      <div style={{ ...S.card, borderColor: `${domain.color}30`, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: domain.color, letterSpacing: 1, marginBottom: 4 }}>{domain.label} · {factorIdx + 1}/{domain.factors.length}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9" }}>{factor.label}</div>
          </div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>{factorAnswered}/3 回答</div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
          {factor.questions.map(q => (
            <QuestionBlock key={q.id} question={q} score={scores[q.id] || 0} onScore={setScore} factorColor={domain.color} />
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {(factorIdx > 0 || domainIdx > 0) && (
          <button onClick={() => { if (factorIdx > 0) setFactorIdx(factorIdx - 1); else { setDomainIdx(domainIdx - 1); setFactorIdx(L2_DOMAINS[domainIdx - 1].factors.length - 1); } }} style={S.ghost}>← 前へ</button>
        )}
        {allDone ? (
          <button onClick={onNext} style={S.primary}>結果を見る →</button>
        ) : !isLastFactor || !isLastDomain ? (
          <button onClick={goNext} disabled={factorAnswered < 3} style={{ ...S.primary, opacity: factorAnswered < 3 ? 0.4 : 1, background: `linear-gradient(135deg, ${domain.color}cc, ${domain.color})` }}>
            次へ →
          </button>
        ) : (
          <button onClick={onNext} disabled={!allDone} style={{ ...S.primary, opacity: allDone ? 1 : 0.4 }}>
            {allDone ? "結果を見る →" : `あと ${30 - totalAnswered} 問残っています`}
          </button>
        )}
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}

// ─── PHASE: RESULT ───────────────────────────────────────────────────────────

function ResultPhase({ scores, onRestart }) {
  const l1Scores = L1_FACTORS.map(f => ({ ...f, score: avg(f.questions.map(q => q.id), scores) }));
  const l2Scores = L2_DOMAINS.map(d => ({
    ...d,
    score: avg(d.factors.flatMap(f => f.questions.map(q => q.id)), scores),
    factors: d.factors.map(f => ({ ...f, score: avg(f.questions.map(q => q.id), scores) })),
  }));

  const allFactors = [...l1Scores, ...l2Scores.flatMap(d => d.factors)];
  const overallScore = parseFloat((allFactors.reduce((a, f) => a + f.score, 0) / allFactors.length).toFixed(2));

  const radarData = [
    ...l1Scores.map(f => ({ subject: f.label.length > 6 ? f.label.slice(0, 6) + "…" : f.label, score: f.score, ref: f.ref })),
    ...l2Scores.map(d => ({ subject: d.label, score: d.score, ref: avg(d.factors.map(f => f.ref), {}) })),
  ];

  const high = allFactors.filter(f => f.score >= 4).sort((a, b) => b.score - a.score);
  const mid = allFactors.filter(f => f.score >= 2.5 && f.score < 4);
  const low = allFactors.filter(f => f.score > 0 && f.score < 2.5).sort((a, b) => a.score - b.score);

  const printResult = () => {
    const w = window.open("", "_blank");
    const factorRows = allFactors.map(f => {
      const t = tierLabel(f.score);
      return `<tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;">${f.label}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center;font-weight:600;color:${t.color.replace("#","") === "34d399" ? "#059669" : t.color.replace("#","") === "fbbf24" ? "#d97706" : "#e11d48"};">${f.score}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;font-size:12px;color:#4b5563;">${t.label}</td></tr>`;
    }).join("");
    const commentRows = allFactors.filter(f => f.score > 0).map(f => `<div style="margin-bottom:16px;padding:12px;background:#f9fafb;border-radius:8px;"><div style="font-weight:600;margin-bottom:4px;font-size:13px;">${f.label}（${f.score}）</div><div style="font-size:12px;color:#4b5563;line-height:1.7;">${getComment(f, f.score)}</div></div>`).join("");
    w.document.write(`<!DOCTYPE html><html><head><title>変革者の素質診断 結果レポート</title><style>body{font-family:'Hiragino Sans',sans-serif;color:#111;padding:40px;max-width:700px;margin:0 auto;}h1{font-size:22px;border-bottom:2px solid #111;padding-bottom:12px;}h2{font-size:16px;margin-top:32px;border-left:4px solid #7c3aed;padding-left:10px;}table{width:100%;border-collapse:collapse;}@media print{body{padding:20px;}}</style></head><body><h1>変革者の素質診断　結果レポート</h1><p style="color:#6b7280;font-size:12px;">実施日：${new Date().toLocaleDateString("ja-JP")} ／ 総合スコア：${overallScore} / 5.00</p><p style="font-size:12px;background:#fef9c3;padding:10px;border-radius:6px;">この結果は診断ではなく、自己理解のための参考情報です。回答時の状況や気持ちによって変わることがあります。</p><h2>因子別スコア一覧</h2><table><thead><tr><th style="text-align:left;padding:8px;border-bottom:2px solid #111;">因子</th><th style="padding:8px;border-bottom:2px solid #111;">スコア</th><th style="text-align:left;padding:8px;border-bottom:2px solid #111;">傾向</th></tr></thead><tbody>${factorRows}</tbody></table><h2>因子ごとの参考コメント</h2>${commentRows}<p style="margin-top:40px;font-size:12px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:16px;">このレポートは、今この瞬間のあなたのスナップショットです。3ヶ月後、半年後に再度試してみると、変化に気づけることがあります。</p></body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: "#60a5fa", letterSpacing: 2, marginBottom: 4 }}>LEVEL 3 · 統合レポート</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9" }}>診断結果</h2>
        <p style={{ fontSize: 12, color: "#6b7280" }}>{new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <div style={{ ...S.card, marginBottom: 16, borderColor: "rgba(251,191,36,0.15)" }}>
        <p style={{ fontSize: 12, color: "#fbbf24", lineHeight: 1.7, margin: 0 }}>
          この結果は診断ではなく、自己理解のための参考情報です。回答時の状況や気持ちによって変わることがあります。
        </p>
      </div>

      <div style={{ ...S.card, marginBottom: 16, textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 8, letterSpacing: 2 }}>総合スコア</div>
        <div style={{ fontSize: 52, fontWeight: 800, color: overallScore >= 4 ? "#34d399" : overallScore >= 2.5 ? "#fbbf24" : "#fb7185", lineHeight: 1 }}>{overallScore}</div>
        <div style={{ fontSize: 13, color: "#4b5563" }}>/ 5.00</div>
      </div>

      <div style={{ ...S.card, marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 4 }}>変革者傾向値との比較</div>
        <div style={{ fontSize: 11, color: "#4b5563", marginBottom: 16 }}>事業変革に携わってきたリーダーたちの思想・判断・素質を分析した傾向値との比較です。正解・不正解ではなく、参考の座標としてご覧ください。</div>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#6b7280", fontSize: 10 }} />
            <Radar name="あなた" dataKey="score" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.2} strokeWidth={2} />
            <Radar name="変革者参照値" dataKey="ref" stroke="#34d399" fill="#34d399" fillOpacity={0.1} strokeWidth={1} strokeDasharray="4 4" />
            <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: 8, fontSize: 11 }} formatter={(v, name) => [`${v}`, name]} />
          </RadarChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#9ca3af" }}><div style={{ width: 16, height: 2, background: "#a78bfa" }} />あなた</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#9ca3af" }}><div style={{ width: 16, height: 2, background: "#34d399", borderTop: "1px dashed #34d399" }} />参照値</div>
        </div>
      </div>

      {[
        { items: high, title: "自然に滲み出ている領域", color: "#34d399", icon: "✦" },
        { items: mid, title: "状況によって変わる領域", color: "#fbbf24", icon: "◈" },
        { items: low, title: "意識することで広がる領域", color: "#fb7185", icon: "▲" },
      ].filter(g => g.items.length > 0).map(group => (
        <div key={group.title} style={{ ...S.card, marginBottom: 16, borderColor: `${group.color}25` }}>
          <div style={{ fontSize: 12, color: group.color, marginBottom: 12 }}>{group.icon} {group.title}</div>
          {group.items.map(f => (
            <div key={f.id} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{f.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: group.color }}>{f.score}</span>
              </div>
              <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.7, margin: 0 }}>{getComment(f, f.score)}</p>
            </div>
          ))}
        </div>
      ))}

      <div style={{ ...S.card, marginBottom: 24, borderColor: "rgba(96,165,250,0.2)", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "#60a5fa", lineHeight: 1.8, margin: 0 }}>
          このレポートは、今この瞬間のあなたのスナップショットです。<br />
          3ヶ月後、半年後に再度試してみると、変化に気づけることがあります。
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
        <button onClick={printResult} style={S.primary}>PDFで出力する</button>
        <button onClick={onRestart} style={S.ghost}>最初から</button>
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function App() {
  const [phase, setPhase] = useState("intro");
  const [scores, setScores] = useState({});

  const setScore = (id, val) => setScores(prev => ({ ...prev, [id]: val }));

  return (
    <div style={S.page}>
      {phase === "intro" && <IntroPhase onStart={() => setPhase("level1")} />}
      {phase === "level1" && <Level1Phase scores={scores} setScore={setScore} onNext={() => setPhase("level2")} />}
      {phase === "level2" && <Level2Phase scores={scores} setScore={setScore} onNext={() => setPhase("result")} />}
      {phase === "result" && <ResultPhase scores={scores} onRestart={() => { setScores({}); setPhase("intro"); }} />}
    </div>
  );
}
