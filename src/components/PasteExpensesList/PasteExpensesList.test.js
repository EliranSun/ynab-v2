import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PasteExpensesList } from "./PasteExpensesList";

const expenses =  [
      {
        id: 'bfb9c64f-3a06-4992-a430-355d7e5d534f',
        name: 'MIDJOURNEY INC.',
        isThirdParty: false,
        amount: 30.64,
        note: '',
        timestamp: 1691798400000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '6250622c-d2e3-473c-8488-ce00668552ab',
        name: 'PAYPAL *ALAXON',
        isThirdParty: false,
        amount: 25,
        note: '',
        timestamp: 1691798400000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: 'aee8c802-5644-408d-95ea-dcdf50ebf1e4',
        name: 'LIM*RIDE COST',
        isThirdParty: false,
        amount: 22,
        note: '',
        timestamp: 1691712000000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '14b9745f-dd12-4683-9f05-a0d60da688b9',
        name: 'LIM*RIDE COST',
        isThirdParty: false,
        amount: 28,
        note: '',
        timestamp: 1691712000000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '2df02d6b-06d0-489c-8401-f3c94b88ef05',
        name: 'LIM*RIDE COST',
        isThirdParty: false,
        amount: 22,
        note: '',
        timestamp: 1691712000000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '6a90b657-1c8d-494d-afa4-902a790bf812',
        name: 'LIM*RIDE COST',
        isThirdParty: false,
        amount: 16,
        note: '',
        timestamp: 1691539200000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: 'ff70ba6e-4da5-4e30-b57d-28ca6b39c743',
        name: 'AMZN MKTP US*TA4A54V',
        isThirdParty: false,
        amount: 104.95,
        note: '',
        timestamp: 1691452800000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: 'dfe81a31-1c43-4ea7-8600-1a4f80fd63dc',
        name: 'AMZN MKTP US*TA8WR6Q',
        isThirdParty: false,
        amount: 84.62,
        note: '',
        timestamp: 1691452800000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: 'e126bfc9-6aa3-4380-a2e3-f14353a56d55',
        name: 'LIM*RIDE COST',
        isThirdParty: false,
        amount: 22,
        note: '',
        timestamp: 1691366400000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: 'dca58420-917a-4e18-baa3-76924c651209',
        name: 'SP TIMELESS SKIN CAR',
        isThirdParty: false,
        amount: 109.5,
        note: '',
        timestamp: 1691366400000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '4da39003-eeb5-4a1a-b843-e823f746984c',
        name: 'APPLE.COM/BILL',
        isThirdParty: false,
        amount: 3.9,
        note: '',
        timestamp: 1690934400000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '3e743df4-c68e-489b-b038-6d27bc52765c',
        name: 'מוזס שופ מידטאון',
        isThirdParty: false,
        amount: 73,
        note: '',
        timestamp: 1691884800000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: 'be8b0ab2-3619-409a-822c-d196c34217ce',
        name: 'גריל ישראלי ישראלי ר',
        isThirdParty: false,
        amount: 100,
        note: '',
        timestamp: 1691712000000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: 'f3886b6d-9e56-466f-bc19-e85d0e827344',
        name: 'WOLT',
        isThirdParty: false,
        amount: 115,
        note: '',
        timestamp: 1691539200000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '44701fea-d29d-44a8-a4b1-db32b7e90301',
        name: 'שומשום בר בריאות',
        isThirdParty: false,
        amount: 24.05,
        note: '',
        timestamp: 1691539200000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: 'bba9c44c-efe3-4bb4-a0ae-95e6d1ee7d1d',
        name: 'dna',
        isThirdParty: false,
        amount: 69,
        note: '',
        timestamp: 1691020800000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '86e99d24-dadc-42f7-a50a-90b9415ca83f',
        name: 'מוזס שופ מידטאון',
        isThirdParty: false,
        amount: 73,
        note: '',
        timestamp: 1690934400000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: 'c5f01fc6-c1a1-4aa4-9e46-ccefd5358236',
        name: 'יס פלאנט ראשל"צ- מזנ',
        isThirdParty: false,
        amount: 83,
        note: '',
        timestamp: 1691625600000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: 'b91c5fe8-fe0c-40b3-a6dc-593c5a379128',
        name: 'יס פלאנט ראשל"צ-אינט',
        isThirdParty: false,
        amount: 94,
        note: '',
        timestamp: 1691452800000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '599978c7-2d23-4f15-aa67-3ee6bd158f15',
        name: 'יס פלאנט ראשל"צ-אינט',
        isThirdParty: false,
        amount: 94,
        note: '',
        timestamp: 1691452800000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '6fe24492-7577-447d-a22d-d3f0bb4b08ad',
        name: 'יס פלאנט ראשל"צ-אינט',
        isThirdParty: false,
        amount: -85,
        note: '',
        timestamp: 1691452800000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '61276913-ef97-42fc-ad47-65dbe62fc2b8',
        name: 'יס פלאנט איילוון- מז',
        isThirdParty: false,
        amount: 20,
        note: '',
        timestamp: 1691107200000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: 'aa983106-e8ad-4545-8e1b-b270c6cae19d',
        name: 'יס פלאנט איילון-אינט',
        isThirdParty: false,
        amount: 9,
        note: '',
        timestamp: 1691020800000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '4163f584-4c97-446d-ab23-342da46ea0a0',
        name: 'מרכז הספורט באוניברס',
        isThirdParty: false,
        amount: 397.42,
        note: '',
        timestamp: 1688342400000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '128c5af1-9787-46b7-87c9-267b603c0446',
        name: 'שופרסל שלי נורדאו',
        isThirdParty: false,
        amount: 93.2,
        note: '',
        timestamp: 1691971200000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '0831ab5b-c92e-43be-81fe-7f2e1bfacc18',
        name: 'שופרסל שלי נורדאו',
        isThirdParty: false,
        amount: 63.3,
        note: '',
        timestamp: 1691712000000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '18f303a9-a21b-4f2f-a65a-0da11b9b279c',
        name: "משקאות חינאווי ג'ורג",
        isThirdParty: false,
        amount: 64.9,
        note: '',
        timestamp: 1691539200000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: 'd56ca984-3b41-44d8-b4a0-ad386368883b',
        name: 'שופרסל שלי נורדאו',
        isThirdParty: false,
        amount: 12.1,
        note: '',
        timestamp: 1691366400000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '4afb819f-49e5-4f52-ba31-62b7cbea7b64',
        name: 'PM AM הקסטל.',
        isThirdParty: false,
        amount: 18.9,
        note: '',
        timestamp: 1691280000000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '82885bc2-e508-40c4-9d4c-d1d305345684',
        name: `שופרסל שלי רמה"ש א'`,
        isThirdParty: false,
        amount: 6.2,
        note: '',
        timestamp: 1691020800000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '8d18994a-addf-4e2d-871b-5870d908ea93',
        name: 'סופר אמריקה-צמרת',
        isThirdParty: false,
        amount: 58.5,
        note: '',
        timestamp: 1690934400000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '5216f05e-b236-480d-9c2c-e0a7556a2b08',
        name: 'כרמלה',
        isThirdParty: false,
        amount: 299.83,
        note: '',
        timestamp: 1690848000000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '5a0b7c94-9887-4055-a1c4-cd32d5bbdd17',
        name: 'רמי לוי אינטרנט/ארנק',
        isThirdParty: false,
        amount: 237,
        note: '',
        timestamp: 1690848000000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: 'd3830244-90f4-4b1a-8fc3-62cf7342ef71',
        name: 'הפי סאן דרינקס',
        isThirdParty: false,
        amount: 99,
        note: '',
        timestamp: 1690848000000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: 'd3cb2326-0ba4-4ccd-9c7f-19e860d1a8ce',
        name: 'פוקס הום ד"ס',
        isThirdParty: false,
        amount: 11.99,
        note: '',
        timestamp: 1691452800000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: 'e68298d4-16f7-411e-84e0-1fe7dfa5641b',
        name: 'סופר פארם קסטל תל אב',
        isThirdParty: false,
        amount: 110.7,
        note: '',
        timestamp: 1691798400000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '9bdbcc1f-7553-499c-88ce-d439fb2088b6',
        name: 'קיי.אס.פי מחשבים-גמא',
        isThirdParty: false,
        amount: 399,
        note: '',
        timestamp: 1691884800000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: 'c63fd343-9158-4e22-8d04-a9ab303203d9',
        name: 'WECOM',
        isThirdParty: false,
        amount: 29,
        note: '',
        timestamp: 1691884800000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: 'bab6df98-d923-40a4-acfc-fff88c6ef392',
        name: 'DARIMPO תשלום לבניין',
        isThirdParty: false,
        amount: 147,
        note: '',
        timestamp: 1691020800000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '0ebda486-7ba9-44b8-82b4-37459ece2621',
        name: 'קיי.אס.פי מחשבים-גמא',
        isThirdParty: false,
        amount: 490,
        note: '',
        timestamp: 1690934400000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '947add62-b6e1-4216-8bca-2e60af30e13d',
        name: 'קיי.אס.פי מחשבים-גמא',
        isThirdParty: false,
        amount: 489,
        note: '',
        timestamp: 1690934400000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '325d85f3-b89f-43c3-aa39-ffbc75962346',
        name: "חב' חשמל דן חשבונות",
        isThirdParty: false,
        amount: 535.23,
        note: '',
        timestamp: 1691798400000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: 'ccddd3a0-e65a-4c47-b767-14b495d026d9',
        name: 'ע.מפעולות-ישיר',
        isThirdParty: false,
        amount: 36.75,
        note: '',
        timestamp: 1691020800000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '59e84ecf-5509-491e-8b26-d6e11db9de7e',
        name: 'Harimon',
        isThirdParty: false,
        amount: 17.22,
        note: '',
        timestamp: 1691884800000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '8c906f8d-c7c6-49f4-a523-b87b688b2735',
        name: 'גג לחיות בע"מ',
        isThirdParty: false,
        amount: 231.9,
        note: '',
        timestamp: 1691798400000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '296a193a-5629-431d-b17c-233848f0d185',
        name: 'WINE LAB',
        isThirdParty: false,
        amount: 110,
        note: '',
        timestamp: 1691798400000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '14789c7e-f49c-49a8-91a9-055a25275648',
        name: 'WOLT',
        isThirdParty: false,
        amount: 84,
        note: '',
        timestamp: 1691798400000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '367d8866-6bd9-40b1-aba9-5213c8d244a1',
        name: 'פיימנט',
        isThirdParty: false,
        amount: 1067.66,
        note: '',
        timestamp: 1691625600000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '7901fb22-214b-47b8-a52a-a6c96a7a25d5',
        name: 'עיגול לטובה אור ירוק',
        isThirdParty: false,
        amount: 19.68,
        note: '',
        timestamp: 1691539200000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '4d4f98d2-25c3-43f4-9eaa-b8760d659c44',
        name: 'WOLT',
        isThirdParty: false,
        amount: 10.8,
        note: '',
        timestamp: 1691452800000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '64b8ec6c-c5b1-4d63-b147-893b2c71d9ea',
        name: 'תיאטרון האימפרוב',
        isThirdParty: false,
        amount: 70,
        note: '',
        timestamp: 1691020800000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '44ce9650-18a2-4ee7-8a43-97c4c928701d',
        name: 'poalim wonder הי ביז',
        isThirdParty: false,
        amount: 42,
        note: '',
        timestamp: 1691020800000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '4347f352-c7a6-4575-9ce4-d9e2c668f7f4',
        name: "העב' לאחר-נייד",
        isThirdParty: true,
        amount: 7500,
        note: '',
        timestamp: 1690848000000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '876a55a2-5b0b-4a02-8f4f-6ed3cc75e32f',
        name: 'אור ירוק',
        isThirdParty: false,
        amount: 30,
        note: '',
        timestamp: 1684108800000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: 'ce349572-2832-4fee-8ae7-2b81b62e20ee',
        name: 'משיכה מבנקט',
        isThirdParty: false,
        amount: 206.9,
        note: '',
        timestamp: 1691366400000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '2a1ae549-bf3b-4a45-8141-8e2925f6c005',
        name: 'משכורת',
        isThirdParty: false,
        amount: 18632,
        note: '',
        timestamp: 1688256000000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '4cf6c399-e330-4b1e-8c30-f21a3d83a253',
        name: 'מפייבוקס שלי',
        isThirdParty: false,
        amount: 4500,
        note: '',
        timestamp: 1688947200000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '25019763-24c2-4303-b929-7c09ed85f657',
        name: 'bit העברת כסף',
        isThirdParty: true,
        amount: 45.01,
        note: '',
        timestamp: 1688256000000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: 'f9f7b8bf-a5a3-46c8-93b6-4026f94b8646',
        name: 'bit העברת כסף',
        isThirdParty: true,
        amount: 30,
        note: '',
        timestamp: 1688256000000,
        categoryId: null,
        transactionsCount: 0
      },
      {
        id: '5eb422d4-7ad0-44fc-a561-b21ec7bbe4b2',
        name: 'bit העברת כסף',
        isThirdParty: true,
        amount: 17,
        note: '',
        timestamp: 1688256000000,
        categoryId: null,
        transactionsCount: 0
      }
];
const text = `
MIDJOURNEY INC.\t12/08/23\t9640\tנטרל\t30.64 ₪\t
PAYPAL *ALAXON\t12/08/23\t9640\tנטרל\t25.00 ₪\t
LIM*RIDE COST\t11/08/23\t9640\tנטרל\t22.00 ₪\t
LIM*RIDE COST\t11/08/23\t9640\tנטרל\t28.00 ₪\t
LIM*RIDE COST\t11/08/23\t9640\tנטרל\t22.00 ₪\t
LIM*RIDE COST\t09/08/23\t9640\tנטרל\t16.00 ₪\t
AMZN MKTP US*TA4A54V\t08/08/23\t9640\tנטרל\t104.95 ₪\t
AMZN MKTP US*TA8WR6Q\t08/08/23\t9640\tנטרל\t84.62 ₪\t
LIM*RIDE COST\t07/08/23\t9640\tנטרל\t22.00 ₪\t
SP TIMELESS SKIN CAR\t07/08/23\t9640\tנטרל\t109.50 ₪\t
APPLE.COM/BILL\t02/08/23\t9640\tנטרל\t3.90 ₪\t
סה"כ נופש\t468.61 ₪\t3.32%
בילוי ומסעדות
מה תרצה לעשות?\t
מוזס שופ מידטאון\t13/08/23\t9640\tנטרל\t73.00 ₪\t
גריל ישראלי ישראלי ר\t11/08/23\t9640\tנטרל\t100.00 ₪\t
WOLT\t09/08/23\t9640\tנטרל\t115.00 ₪\t
שומשום בר בריאות\t09/08/23\t9640\tנטרל\t24.05 ₪\t
dna\t03/08/23\t9640\tנטרל\t69.00 ₪\t
מוזס שופ מידטאון\t02/08/23\t9640\tנטרל\t73.00 ₪\t
סה"כ בילוי ומסעדות\t454.05 ₪\t3.21%
תרבות ופנאי
מה תרצה לעשות?\t
יס פלאנט ראשל"צ- מזנ\t10/08/23\t9640\tנטרל\t83.00 ₪\t
יס פלאנט ראשל"צ-אינט\t08/08/23\t9640\tנטרל\t94.00 ₪\t
יס פלאנט ראשל"צ-אינט\t08/08/23\t9640\tנטרל\t94.00 ₪\t
יס פלאנט ראשל"צ-אינט\t08/08/23\t9640\tנטרל\t-85.00 ₪\t
יס פלאנט איילוון- מז\t04/08/23\t9640\tנטרל\t20.00 ₪\t
יס פלאנט איילון-אינט\t03/08/23\t9640\tנטרל\t9.00 ₪\t
מרכז הספורט באוניברס\t03/07/23\t9640\t נטרל\t397.42 ₪\t
סה"כ תרבות ופנאי\t612.42 ₪\t4.34%
מזון ומשקאות
מה תרצה לעשות?\t
שופרסל שלי נורדאו\t14/08/23\t9640\tנטרל\t93.20 ₪\t
שופרסל שלי נורדאו\t11/08/23\t9640\tנטרל\t63.30 ₪\t
משקאות חינאווי ג'ורג\t09/08/23\t9640\tנטרל\t64.90 ₪\t
שופרסל שלי נורדאו\t07/08/23\t9640\tנטרל\t12.10 ₪\t
PM AM הקסטל.\t06/08/23\t9640\tנטרל\t18.90 ₪\t
שופרסל שלי רמה"ש א'\t03/08/23\t9640\tנטרל\t6.20 ₪\t
סופר אמריקה-צמרת\t02/08/23\t9640\tנטרל\t58.50 ₪\t
כרמלה\t01/08/23\t9640\tנטרל\t299.83 ₪\t
רמי לוי אינטרנט/ארנק\t01/08/23\t9640\tנטרל\t237.00 ₪\t
הפי סאן דרינקס\t01/08/23\t9640\tנטרל\t99.00 ₪\t
סה"כ מזון ומשקאות\t952.93 ₪\t6.75%
ביגוד והנעלה
מה תרצה לעשות?\t
פוקס הום ד"ס\t08/08/23\t9640\tנטרל\t11.99 ₪\t
סה"כ ביגוד והנעלה\t11.99 ₪\t0.08%
בריאות
מה תרצה לעשות?\t
סופר פארם קסטל תל אב\t12/08/23\t9640\tנטרל\t110.70 ₪\t
סה"כ בריאות\t110.70 ₪\t0.78%
מוצרי חשמל ותקשורת
מה תרצה לעשות?\t
קיי.אס.פי מחשבים-גמא\t13/08/23\t9640\tנטרל\t399.00 ₪\t
WECOM\t13/08/23\t9640\tנטרל\t29.00 ₪\t
DARIMPO תשלום לבניין\t03/08/23\t9640\tנטרל\t147.00 ₪\t
קיי.אס.פי מחשבים-גמא\t02/08/23\t9640\t נטרל\t490.00 ₪\t
קיי.אס.פי מחשבים-גמא\t02/08/23\t9640\t נטרל\t489.00 ₪\t
סה"כ מוצרי חשמל ותקשורת\t1,554.00 ₪\t11%
מיסים ותשלומים
מה תרצה לעשות?\t
חב' חשמל דן חשבונות\t12/08/23\t9640\tנטרל\t535.23 ₪\t
סה"כ מיסים ותשלומים\t535.23 ₪\t3.79%
שירותי בנקאות
מה תרצה לעשות?\t
ע.מפעולות-ישיר\t03/08/23\t500-489746\tנטרל\t36.75 ₪\t
סה"כ שירותי בנקאות\t36.75 ₪\t0.26%
שונות
11 הוצאות מחכות לסידור 
מה תרצה לעשות?\t
Harimon\t13/08/23\t4887\t נטרל\t17.22 ₪\t
גג לחיות בע"מ\t12/08/23\t9640\tנטרל\t231.90 ₪\t
WINE LAB\t12/08/23\t9640\tנטרל\t110.00 ₪\t
WOLT\t12/08/23\t9640\tנטרל\t84.00 ₪\t
פיימנט\t10/08/23\t500-489746\tנטרל\t1,067.66 ₪\t
עיגול לטובה אור ירוק\t09/08/23\t9640\tנטרל\t19.68 ₪\t
WOLT\t08/08/23\t9640\tנטרל\t10.80 ₪\t
תיאטרון האימפרוב\t03/08/23\t9640\tנטרל\t70.00 ₪\t
poalim wonder הי ביז\t03/08/23\t9640\tנטרל\t42.00 ₪\t
העב' לאחר-נייד\t01/08/23\t500-489746\tנטרל\t7,500.00 ₪\t
אור ירוק\t15/05/23\t9640\t נטרל\t30.00 ₪\t
סה"כ שונות\t9,183.26 ₪\t65.01%
מזומן
מה תרצה לעשות?\t
משיכה מבנקט\t07/08/23\t500-489746\tנטרל\t206.90 ₪
משכורת\t01/08/23\t500-489746\tנטרל\t20,180.00 ₪\t
סה"כ משכורת/קצבה\t20,180.00 ₪\t84.33%
הכנסות אחרות
מה תרצה לעשות?\t
מפייבוקס שלי\t03/08/23\t500-489746\tנטרל\t3,750.00 ₪
`;


describe.only('Paste Expenses List', () => {
  test('User should see a textarea and paste text', async () => {
    //-------------------------- Arrange ---------------------------
    render(<PasteExpensesList/>);
    
    //--------------------------- Assert ----------------------------
    expect(await screen.findByRole('textbox')).toBeInTheDocument();
  });
  
  test('User should be able to parse expenses from text', async () => {
    //-------------------------- Arrange ---------------------------
    const EXPECTED_PARSED_EXPENSES = 57;
    const user = userEvent.setup();
    render(
        <PasteExpensesList
          text={text}
          expenses={[]} 
          setExpenses={expenses => {
            expect(expenses).toHaveLength(EXPECTED_PARSED_EXPENSES);
          }}/>
    );
    
    //---------------------------- Act ------------------------------
    expect(await screen.findByRole('textbox')).toHaveValue(text);
    user.click(await screen.findByRole('button'));
    
    //--------------------------- Assert ----------------------------
    expect(await screen.findByText(`Parsed ${EXPECTED_PARSED_EXPENSES} expenses`)).toBeInTheDocument();
  });
  
  let totalExpenses = [...expenses];
  test('User should be able to add new expenses', async () => {
    //-------------------------- Arrange ---------------------------
    // on of the expenses is recurring
    const EXPECTED_PARSED_EXPENSES = 2;
    const user = userEvent.setup();
    
    render(
        <PasteExpensesList 
            text={text} 
            expenses={expenses} 
            setExpenses={newExpenses => {
              totalExpenses = totalExpenses.concat(newExpenses);
              expect(newExpenses).toHaveLength(EXPECTED_PARSED_EXPENSES);
            }}/>
    );
    expect(await screen.findByRole('textbox')).toHaveValue(text);
    
    //---------------------------- Act ------------------------------
    user.click(await screen.findByRole('button'));
    
    //--------------------------- Assert ----------------------------
    expect(await screen.findByText(`Parsed ${EXPECTED_PARSED_EXPENSES} expenses`)).toBeInTheDocument();
    
  });
  
  test('User should not see duplicate expenses', async () => {
    //-------------------------- Arrange ---------------------------
    const user = userEvent.setup();
    render(<PasteExpensesList text={text} expenses={totalExpenses}/>);
    expect(await screen.findByRole('textbox')).toHaveValue(text);
    
    //---------------------------- Act ------------------------------
    user.click(await screen.findByRole('button'));
    
    //--------------------------- Assert ----------------------------
    expect(await screen.findByText('No new expenses found in this paste')).toBeInTheDocument();
  });
});