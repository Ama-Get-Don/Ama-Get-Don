export interface Question {
    id: number;
    content: string;
    response: string;
}

export const beginnerQuestions: Question[] = [
    { id: 1, content: 'IPO가 무엇인가요?', response: 'IPO는 Initial Public Offering의 약자로, 기업이 처음으로 주식을 공개하고 일반 투자자들에게 판매하는 것을 의미합니다.' },
    { id: 2, content: '주식이란 무엇인가요?', response: '주식은 기업의 소유권을 나타내는 증권으로, 주식을 소유하면 그 기업의 일부를 소유하는 것입니다.' },
    { id: 3, content: '주식 시장은 어떻게 작동하나요?', response: '주식 시장은 주식을 사고 팔 수 있는 장소로, 주식의 가격은 수요와 공급에 따라 결정됩니다.' },
    { id: 4, content: '주식을 어떻게 매수하나요?', response: '주식을 매수하려면 증권 계좌를 개설하고, 원하는 주식을 선택한 후 매수 주문을 넣으면 됩니다.' },
    { id: 5, content: '배당금이란 무엇인가요?', response: '배당금은 기업이 이익을 주주에게 분배하는 금액으로, 주식을 보유한 사람들에게 지급됩니다.' },
    { id: 6, content: '주식의 종류에는 어떤 것들이 있나요?', response: '주식에는 보통주와 우선주가 있으며, 보통주는 주주총회에서 의결권을 가지지만 우선주는 배당금을 우선적으로 받습니다.' },
    { id: 7, content: '주식 차트는 어떻게 읽나요?', response: '주식 차트는 시간에 따른 주가 변동을 나타내며, 봉차트, 선차트 등이 있습니다. 봉차트는 캔들스틱이라고도 불리며, 시가, 종가, 고가, 저가를 보여줍니다.' },
    { id: 8, content: '주식 시장의 개장 시간은 언제인가요?', response: '한국 주식 시장은 오전 9시부터 오후 3시 30분까지 개장합니다.' },
    { id: 9, content: '주식을 매수할 때 주의해야 할 점은 무엇인가요?', response: '기업의 재무 상태, 시장 동향, 뉴스 등을 잘 분석하고 매수 결정을 해야 합니다.' },
    { id: 10, content: 'ETF란 무엇인가요?', response: 'ETF는 Exchange Traded Fund의 약자로, 주식처럼 거래되는 펀드입니다. 다양한 자산에 분산 투자할 수 있는 장점이 있습니다.' },
];

export const intermediateQuestions: Question[] = [
    { id: 1, content: 'PER이란 무엇인가요?', response: 'PER은 Price to Earnings Ratio의 약자로, 주가를 주당순이익(EPS)으로 나눈 값입니다. 주가의 적정성을 평가하는 지표입니다.' },
    { id: 2, content: '주식의 기술적 분석이란 무엇인가요?', response: '기술적 분석은 과거 주가와 거래량 데이터를 분석하여 미래의 주가 움직임을 예측하는 방법입니다.' },
    { id: 3, content: '기업의 재무제표를 어떻게 분석하나요?', response: '재무제표는 기업의 재무 상태와 성과를 보여주는 문서로, 손익계산서, 대차대조표, 현금흐름표 등을 분석하여 기업의 가치를 평가합니다.' },
    { id: 4, content: '배당 수익률은 어떻게 계산하나요?', response: '배당 수익률은 주당 배당금을 주가로 나눈 값으로, 배당금을 통해 얻을 수 있는 수익률을 나타냅니다.' },
    { id: 5, content: '주가수익률(PER)과 주가순자산비율(PBR)의 차이는 무엇인가요?', response: 'PER은 주가를 순이익으로 나눈 값이고, PBR은 주가를 순자산으로 나눈 값입니다. 각각 수익성과 자산가치 평가에 사용됩니다.' },
    { id: 6, content: '주식의 가치를 평가하는 방법에는 어떤 것들이 있나요?', response: '주식 가치를 평가하는 방법으로는 PER, PBR, PEG, DCF(할인현금흐름) 등이 있습니다.' },
    { id: 7, content: '매수와 매도의 타이밍을 어떻게 잡나요?', response: '매수와 매도의 타이밍은 기술적 분석, 재무 분석, 시장 뉴스 등을 종합적으로 고려하여 결정합니다.' },
    { id: 8, content: '주식 포트폴리오를 어떻게 구성하나요?', response: '주식 포트폴리오는 다양한 산업과 자산에 분산 투자하여 리스크를 줄이는 방식으로 구성합니다.' },
    { id: 9, content: '장기 투자와 단기 투자의 차이는 무엇인가요?', response: '장기 투자는 오랜 기간 주식을 보유하여 수익을 얻는 방식이고, 단기 투자는 짧은 기간 내에 주가 변동을 이용하여 수익을 얻는 방식입니다.' },
    { id: 10, content: '주가가 급등할 때와 급락할 때 어떻게 대응해야 하나요?', response: '급등할 때는 수익 실현의 기회를 찾고, 급락할 때는 냉정하게 상황을 분석하여 추가 매수나 손절매를 결정합니다.' },
];

export const advancedQuestions: Question[] = [
    { id: 1, content: '퀀트 투자란 무엇인가요?', response: '퀀트 투자는 수학적 모델과 통계적 분석을 통해 투자 결정을 내리는 방법입니다. 알고리즘을 이용하여 자동 매매를 하기도 합니다.' },
    { id: 2, content: '알고리즘 트레이딩은 어떻게 작동하나요?', response: '알고리즘 트레이딩은 컴퓨터 프로그램을 이용하여 미리 정해진 매매 전략에 따라 자동으로 거래를 실행하는 방식입니다.' },
    { id: 3, content: '헤지펀드의 전략에는 어떤 것들이 있나요?', response: '헤지펀드 전략에는 롱/숏 전략, 시장 중립 전략, 이벤트 드리븐 전략, 매크로 전략 등이 있습니다.' },
    { id: 4, content: '리스크 관리 방법에는 어떤 것들이 있나요?', response: '리스크 관리 방법으로는 분산 투자, 손절매 설정, 파생상품 이용, 포트폴리오 헤징 등이 있습니다.' },
    { id: 5, content: '기업 인수합병(M&A) 투자 전략은 무엇인가요?', response: 'M&A 투자 전략은 인수합병이 예상되는 기업에 투자하여 주가 상승을 기대하는 방식입니다. M&A 뉴스와 기업의 재무 상태를 잘 분석해야 합니다.' },
    { id: 6, content: '파생상품(옵션, 선물) 거래는 어떻게 하나요?', response: '파생상품 거래는 옵션과 선물을 이용하여 미래의 자산 가격 변동에 대비하는 방식입니다. 고도의 분석과 리스크 관리가 필요합니다.' },
    { id: 7, content: '특정 산업에 집중 투자하는 방법은 무엇인가요?', response: '특정 산업에 집중 투자하는 방법은 해당 산업의 성장 가능성을 분석하여 관련 주식을 선택하고 집중적으로 투자하는 방식입니다.' },
    { id: 8, content: '배당 성장 투자란 무엇인가요?', response: '배당 성장 투자는 지속적으로 배당금을 증가시키는 기업에 투자하여 안정적인 배당 수익과 주가 상승을 기대하는 방식입니다.' },
    { id: 9, content: '글로벌 주식 시장에 투자하는 방법은 무엇인가요?', response: '글로벌 주식 시장에 투자하는 방법으로는 해외 주식 직접 투자, 글로벌 ETF 투자, 해외 펀드 투자가 있습니다.' },
    { id: 10, content: 'ESG 투자란 무엇인가요?', response: 'ESG 투자는 환경(Environment), 사회(Social), 지배구조(Governance) 등 비재무적 요소를 고려하여 투자하는 방식입니다. 지속 가능한 경영을 하는 기업에 투자합니다.' },
];