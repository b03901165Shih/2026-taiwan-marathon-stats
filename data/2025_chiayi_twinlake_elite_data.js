// ================================================
// 2025 嘉義雙潭馬拉松菁英賽 前處理資料
// 生成時間：2026-10-04 10:39:25
// 總人數：0人
// 包含：histogram_5min + sorted_seconds
// ================================================

window.marathonData = window.marathonData || {};

// 2025 嘉義雙潭馬拉松菁英賽 資料
window.marathonData['2025_chiayi_twinlake_elite'] = {
  "metadata": {
    "event_id": "2025_chiayi_twinlake_elite",
    "event_name": "2025 嘉義雙潭馬拉松菁英賽",
    "event_date": "2025-11-30",
    "generated_at": "2026-10-04 10:39:25",
    "total_participants": 0,
    "race_types": [
      "全馬組",
      "半馬組"
    ],
    "race_distances_km": {
      "全馬組": 42.195,
      "半馬組": 21.0975
    },
    "group_categories": [
      "ALL",
      "一般",
      "輪椅",
      "視障"
    ],
    "data_structure": {
      "histogram_bin_size": "5min",
      "percentile_precision": "0.1%",
      "time_format": "HH:MM:SS"
    },
    "source_url": "https://www.bravelog.tw/contest/rank/2025113001",
    "notes": "逐筆核對 BraveLog 公開總排名及大會時間，未列總排名者不納入比較；主辦最終公告優先。",
    "group_age_ranges": {
      "全馬組": {
        "男A組": [
          0,
          19
        ],
        "男B組": [
          20,
          29
        ],
        "男C組": [
          30,
          39
        ],
        "男D組": [
          40,
          49
        ],
        "男E組": [
          50,
          59
        ],
        "男F組": [
          60,
          69
        ],
        "男G組": [
          70,
          null
        ],
        "女B組": [
          20,
          29
        ],
        "女C組": [
          30,
          39
        ],
        "女D組": [
          40,
          49
        ],
        "女E組": [
          50,
          59
        ]
      },
      "半馬組": {
        "男A組": [
          0,
          19
        ],
        "男B組": [
          20,
          29
        ],
        "男C組": [
          30,
          39
        ],
        "男D組": [
          40,
          49
        ],
        "男E組": [
          50,
          59
        ],
        "男F組": [
          60,
          69
        ],
        "男G組": [
          70,
          null
        ],
        "女A組": [
          0,
          19
        ],
        "女B組": [
          20,
          29
        ],
        "女C組": [
          30,
          39
        ],
        "女D組": [
          40,
          49
        ],
        "女E組": [
          50,
          59
        ],
        "女F組": [
          60,
          null
        ]
      }
    },
    "group_age_source": "https://www.ctrun.com.tw/Activity/?EventMain_ID=263&Article_ID=5585",
    "ranking_audit": {
      "version": 1,
      "event_id": "2025_chiayi_twinlake_elite",
      "checked_at": "2026-10-04T00:41:39.488578+00:00",
      "method": "bravelog_individual",
      "sources": {
        "全馬組": {
          "url": "https://www.bravelog.tw/contest/rank/2025113001",
          "race_id": "1648",
          "pages": 14,
          "raw_count": 266,
          "profile_count": 266,
          "timed_count": 207,
          "ranked_count": 193,
          "excluded_timed": 14,
          "restored_missing_clock": 0,
          "first_ten_seconds": [
            8488,
            8493,
            8510,
            8686,
            8791,
            9149,
            9173,
            9352,
            9377,
            9658
          ],
          "published_overall_denominators": [
            469
          ]
        },
        "半馬組": {
          "url": "https://www.bravelog.tw/contest/rank/2025113001",
          "race_id": "1649",
          "pages": 39,
          "raw_count": 779,
          "profile_count": 779,
          "timed_count": 670,
          "ranked_count": 662,
          "excluded_timed": 8,
          "restored_missing_clock": 0,
          "first_ten_seconds": [
            4056,
            4064,
            4278,
            4279,
            4473,
            4482,
            4671,
            4672,
            4759,
            4881
          ],
          "published_overall_denominators": [
            1132
          ]
        }
      },
      "public_data_digest": "f639e5de51110dfe7cb9945d36d8a4ca38ad19b97aeecff60d04ca6e5df1c7e8"
    }
  },
  "binsAndPr": {
    "2025_chiayi_twinlake_elite__全馬組__ALL": {
      "histogram_5min": [
        {
          "start_sec": 8400,
          "end_sec": 8700,
          "start_time": "02:20:00",
          "end_time": "02:25:00",
          "count": 4
        },
        {
          "start_sec": 8700,
          "end_sec": 9000,
          "start_time": "02:25:00",
          "end_time": "02:30:00",
          "count": 1
        },
        {
          "start_sec": 9000,
          "end_sec": 9300,
          "start_time": "02:30:00",
          "end_time": "02:35:00",
          "count": 2
        },
        {
          "start_sec": 9300,
          "end_sec": 9600,
          "start_time": "02:35:00",
          "end_time": "02:40:00",
          "count": 2
        },
        {
          "start_sec": 9600,
          "end_sec": 9900,
          "start_time": "02:40:00",
          "end_time": "02:45:00",
          "count": 4
        },
        {
          "start_sec": 9900,
          "end_sec": 10200,
          "start_time": "02:45:00",
          "end_time": "02:50:00",
          "count": 2
        },
        {
          "start_sec": 10200,
          "end_sec": 10500,
          "start_time": "02:50:00",
          "end_time": "02:55:00",
          "count": 1
        },
        {
          "start_sec": 10500,
          "end_sec": 10800,
          "start_time": "02:55:00",
          "end_time": "03:00:00",
          "count": 2
        },
        {
          "start_sec": 10800,
          "end_sec": 11100,
          "start_time": "03:00:00",
          "end_time": "03:05:00",
          "count": 2
        },
        {
          "start_sec": 11100,
          "end_sec": 11400,
          "start_time": "03:05:00",
          "end_time": "03:10:00",
          "count": 6
        },
        {
          "start_sec": 11400,
          "end_sec": 11700,
          "start_time": "03:10:00",
          "end_time": "03:15:00",
          "count": 5
        },
        {
          "start_sec": 11700,
          "end_sec": 12000,
          "start_time": "03:15:00",
          "end_time": "03:20:00",
          "count": 4
        },
        {
          "start_sec": 12000,
          "end_sec": 12300,
          "start_time": "03:20:00",
          "end_time": "03:25:00",
          "count": 2
        },
        {
          "start_sec": 12300,
          "end_sec": 12600,
          "start_time": "03:25:00",
          "end_time": "03:30:00",
          "count": 5
        },
        {
          "start_sec": 12600,
          "end_sec": 12900,
          "start_time": "03:30:00",
          "end_time": "03:35:00",
          "count": 3
        },
        {
          "start_sec": 12900,
          "end_sec": 13200,
          "start_time": "03:35:00",
          "end_time": "03:40:00",
          "count": 4
        },
        {
          "start_sec": 13200,
          "end_sec": 13500,
          "start_time": "03:40:00",
          "end_time": "03:45:00",
          "count": 6
        },
        {
          "start_sec": 13500,
          "end_sec": 13800,
          "start_time": "03:45:00",
          "end_time": "03:50:00",
          "count": 4
        },
        {
          "start_sec": 13800,
          "end_sec": 14100,
          "start_time": "03:50:00",
          "end_time": "03:55:00",
          "count": 3
        },
        {
          "start_sec": 14100,
          "end_sec": 14400,
          "start_time": "03:55:00",
          "end_time": "04:00:00",
          "count": 5
        },
        {
          "start_sec": 14400,
          "end_sec": 14700,
          "start_time": "04:00:00",
          "end_time": "04:05:00",
          "count": 5
        },
        {
          "start_sec": 14700,
          "end_sec": 15000,
          "start_time": "04:05:00",
          "end_time": "04:10:00",
          "count": 1
        },
        {
          "start_sec": 15000,
          "end_sec": 15300,
          "start_time": "04:10:00",
          "end_time": "04:15:00",
          "count": 4
        },
        {
          "start_sec": 15300,
          "end_sec": 15600,
          "start_time": "04:15:00",
          "end_time": "04:20:00",
          "count": 2
        },
        {
          "start_sec": 15600,
          "end_sec": 15900,
          "start_time": "04:20:00",
          "end_time": "04:25:00",
          "count": 5
        },
        {
          "start_sec": 15900,
          "end_sec": 16200,
          "start_time": "04:25:00",
          "end_time": "04:30:00",
          "count": 4
        },
        {
          "start_sec": 16200,
          "end_sec": 16500,
          "start_time": "04:30:00",
          "end_time": "04:35:00",
          "count": 8
        },
        {
          "start_sec": 16500,
          "end_sec": 16800,
          "start_time": "04:35:00",
          "end_time": "04:40:00",
          "count": 8
        },
        {
          "start_sec": 16800,
          "end_sec": 17100,
          "start_time": "04:40:00",
          "end_time": "04:45:00",
          "count": 5
        },
        {
          "start_sec": 17100,
          "end_sec": 17400,
          "start_time": "04:45:00",
          "end_time": "04:50:00",
          "count": 10
        },
        {
          "start_sec": 17400,
          "end_sec": 17700,
          "start_time": "04:50:00",
          "end_time": "04:55:00",
          "count": 5
        },
        {
          "start_sec": 17700,
          "end_sec": 18000,
          "start_time": "04:55:00",
          "end_time": "05:00:00",
          "count": 8
        },
        {
          "start_sec": 18000,
          "end_sec": 18300,
          "start_time": "05:00:00",
          "end_time": "05:05:00",
          "count": 10
        },
        {
          "start_sec": 18300,
          "end_sec": 18600,
          "start_time": "05:05:00",
          "end_time": "05:10:00",
          "count": 6
        },
        {
          "start_sec": 18600,
          "end_sec": 18900,
          "start_time": "05:10:00",
          "end_time": "05:15:00",
          "count": 3
        },
        {
          "start_sec": 18900,
          "end_sec": 19200,
          "start_time": "05:15:00",
          "end_time": "05:20:00",
          "count": 4
        },
        {
          "start_sec": 19200,
          "end_sec": 19500,
          "start_time": "05:20:00",
          "end_time": "05:25:00",
          "count": 5
        },
        {
          "start_sec": 19500,
          "end_sec": 19800,
          "start_time": "05:25:00",
          "end_time": "05:30:00",
          "count": 7
        },
        {
          "start_sec": 19800,
          "end_sec": 20100,
          "start_time": "05:30:00",
          "end_time": "05:35:00",
          "count": 9
        },
        {
          "start_sec": 20100,
          "end_sec": 20400,
          "start_time": "05:35:00",
          "end_time": "05:40:00",
          "count": 2
        },
        {
          "start_sec": 20400,
          "end_sec": 20700,
          "start_time": "05:40:00",
          "end_time": "05:45:00",
          "count": 5
        },
        {
          "start_sec": 20700,
          "end_sec": 21000,
          "start_time": "05:45:00",
          "end_time": "05:50:00",
          "count": 4
        },
        {
          "start_sec": 21000,
          "end_sec": 21300,
          "start_time": "05:50:00",
          "end_time": "05:55:00",
          "count": 5
        },
        {
          "start_sec": 21300,
          "end_sec": 21600,
          "start_time": "05:55:00",
          "end_time": "06:00:00",
          "count": 1
        },
        {
          "start_sec": 21600,
          "end_sec": 21900,
          "start_time": "06:00:00",
          "end_time": "06:05:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        8488,
        8493,
        8510,
        8686,
        8791,
        9149,
        9173,
        9352,
        9377,
        9658,
        9712,
        9797,
        9797,
        9994,
        10044,
        10413,
        10647,
        10665,
        10835,
        10897,
        11153,
        11312,
        11316,
        11316,
        11374,
        11379,
        11412,
        11613,
        11632,
        11639,
        11649,
        11713,
        11767,
        11775,
        11890,
        12221,
        12285,
        12322,
        12337,
        12406,
        12515,
        12547,
        12724,
        12823,
        12893,
        12901,
        12969,
        13001,
        13014,
        13254,
        13316,
        13328,
        13340,
        13428,
        13487,
        13520,
        13599,
        13695,
        13776,
        14028,
        14057,
        14072,
        14150,
        14152,
        14192,
        14311,
        14392,
        14443,
        14456,
        14466,
        14485,
        14556,
        14914,
        15021,
        15026,
        15139,
        15285,
        15395,
        15429,
        15621,
        15723,
        15744,
        15832,
        15890,
        15926,
        15928,
        15971,
        16137,
        16209,
        16214,
        16219,
        16222,
        16234,
        16255,
        16455,
        16463,
        16519,
        16676,
        16724,
        16726,
        16746,
        16755,
        16760,
        16795,
        16826,
        16933,
        16983,
        17060,
        17068,
        17109,
        17209,
        17210,
        17226,
        17231,
        17232,
        17240,
        17307,
        17321,
        17341,
        17438,
        17457,
        17487,
        17510,
        17608,
        17755,
        17756,
        17803,
        17816,
        17821,
        17821,
        17875,
        17880,
        18011,
        18038,
        18080,
        18089,
        18107,
        18133,
        18162,
        18171,
        18215,
        18263,
        18311,
        18359,
        18359,
        18414,
        18464,
        18500,
        18756,
        18800,
        18895,
        19086,
        19121,
        19166,
        19173,
        19202,
        19360,
        19410,
        19481,
        19490,
        19511,
        19580,
        19594,
        19679,
        19695,
        19701,
        19759,
        19858,
        19878,
        19894,
        19927,
        19940,
        19968,
        20045,
        20056,
        20077,
        20339,
        20391,
        20431,
        20554,
        20578,
        20618,
        20644,
        20873,
        20889,
        20922,
        20995,
        21030,
        21170,
        21184,
        21254,
        21294,
        21504
      ]
    },
    "2025_chiayi_twinlake_elite__半馬組__女D組": {
      "histogram_5min": [
        {
          "start_sec": 5400,
          "end_sec": 5700,
          "start_time": "01:30:00",
          "end_time": "01:35:00",
          "count": 1
        },
        {
          "start_sec": 5700,
          "end_sec": 6000,
          "start_time": "01:35:00",
          "end_time": "01:40:00",
          "count": 0
        },
        {
          "start_sec": 6000,
          "end_sec": 6300,
          "start_time": "01:40:00",
          "end_time": "01:45:00",
          "count": 1
        },
        {
          "start_sec": 6300,
          "end_sec": 6600,
          "start_time": "01:45:00",
          "end_time": "01:50:00",
          "count": 4
        },
        {
          "start_sec": 6600,
          "end_sec": 6900,
          "start_time": "01:50:00",
          "end_time": "01:55:00",
          "count": 0
        },
        {
          "start_sec": 6900,
          "end_sec": 7200,
          "start_time": "01:55:00",
          "end_time": "02:00:00",
          "count": 0
        },
        {
          "start_sec": 7200,
          "end_sec": 7500,
          "start_time": "02:00:00",
          "end_time": "02:05:00",
          "count": 1
        },
        {
          "start_sec": 7500,
          "end_sec": 7800,
          "start_time": "02:05:00",
          "end_time": "02:10:00",
          "count": 2
        },
        {
          "start_sec": 7800,
          "end_sec": 8100,
          "start_time": "02:10:00",
          "end_time": "02:15:00",
          "count": 3
        },
        {
          "start_sec": 8100,
          "end_sec": 8400,
          "start_time": "02:15:00",
          "end_time": "02:20:00",
          "count": 5
        },
        {
          "start_sec": 8400,
          "end_sec": 8700,
          "start_time": "02:20:00",
          "end_time": "02:25:00",
          "count": 3
        },
        {
          "start_sec": 8700,
          "end_sec": 9000,
          "start_time": "02:25:00",
          "end_time": "02:30:00",
          "count": 1
        },
        {
          "start_sec": 9000,
          "end_sec": 9300,
          "start_time": "02:30:00",
          "end_time": "02:35:00",
          "count": 1
        },
        {
          "start_sec": 9300,
          "end_sec": 9600,
          "start_time": "02:35:00",
          "end_time": "02:40:00",
          "count": 4
        },
        {
          "start_sec": 9600,
          "end_sec": 9900,
          "start_time": "02:40:00",
          "end_time": "02:45:00",
          "count": 6
        },
        {
          "start_sec": 9900,
          "end_sec": 10200,
          "start_time": "02:45:00",
          "end_time": "02:50:00",
          "count": 3
        },
        {
          "start_sec": 10200,
          "end_sec": 10500,
          "start_time": "02:50:00",
          "end_time": "02:55:00",
          "count": 4
        },
        {
          "start_sec": 10500,
          "end_sec": 10800,
          "start_time": "02:55:00",
          "end_time": "03:00:00",
          "count": 1
        },
        {
          "start_sec": 10800,
          "end_sec": 11100,
          "start_time": "03:00:00",
          "end_time": "03:05:00",
          "count": 0
        },
        {
          "start_sec": 11100,
          "end_sec": 11400,
          "start_time": "03:05:00",
          "end_time": "03:10:00",
          "count": 2
        },
        {
          "start_sec": 11400,
          "end_sec": 11700,
          "start_time": "03:10:00",
          "end_time": "03:15:00",
          "count": 1
        },
        {
          "start_sec": 11700,
          "end_sec": 12000,
          "start_time": "03:15:00",
          "end_time": "03:20:00",
          "count": 0
        },
        {
          "start_sec": 12000,
          "end_sec": 12300,
          "start_time": "03:20:00",
          "end_time": "03:25:00",
          "count": 3
        },
        {
          "start_sec": 12300,
          "end_sec": 12600,
          "start_time": "03:25:00",
          "end_time": "03:30:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        5541,
        6290,
        6402,
        6470,
        6479,
        6591,
        7235,
        7581,
        7760,
        8010,
        8045,
        8063,
        8276,
        8281,
        8304,
        8306,
        8320,
        8412,
        8518,
        8520,
        8963,
        9274,
        9392,
        9393,
        9403,
        9455,
        9640,
        9683,
        9813,
        9865,
        9865,
        9897,
        10032,
        10037,
        10052,
        10299,
        10322,
        10484,
        10487,
        10550,
        11247,
        11377,
        11522,
        12035,
        12051,
        12214
      ]
    },
    "2025_chiayi_twinlake_elite__全馬組__男E組": {
      "histogram_5min": [
        {
          "start_sec": 11100,
          "end_sec": 11400,
          "start_time": "03:05:00",
          "end_time": "03:10:00",
          "count": 1
        },
        {
          "start_sec": 11400,
          "end_sec": 11700,
          "start_time": "03:10:00",
          "end_time": "03:15:00",
          "count": 0
        },
        {
          "start_sec": 11700,
          "end_sec": 12000,
          "start_time": "03:15:00",
          "end_time": "03:20:00",
          "count": 0
        },
        {
          "start_sec": 12000,
          "end_sec": 12300,
          "start_time": "03:20:00",
          "end_time": "03:25:00",
          "count": 0
        },
        {
          "start_sec": 12300,
          "end_sec": 12600,
          "start_time": "03:25:00",
          "end_time": "03:30:00",
          "count": 0
        },
        {
          "start_sec": 12600,
          "end_sec": 12900,
          "start_time": "03:30:00",
          "end_time": "03:35:00",
          "count": 1
        },
        {
          "start_sec": 12900,
          "end_sec": 13200,
          "start_time": "03:35:00",
          "end_time": "03:40:00",
          "count": 0
        },
        {
          "start_sec": 13200,
          "end_sec": 13500,
          "start_time": "03:40:00",
          "end_time": "03:45:00",
          "count": 1
        },
        {
          "start_sec": 13500,
          "end_sec": 13800,
          "start_time": "03:45:00",
          "end_time": "03:50:00",
          "count": 0
        },
        {
          "start_sec": 13800,
          "end_sec": 14100,
          "start_time": "03:50:00",
          "end_time": "03:55:00",
          "count": 0
        },
        {
          "start_sec": 14100,
          "end_sec": 14400,
          "start_time": "03:55:00",
          "end_time": "04:00:00",
          "count": 0
        },
        {
          "start_sec": 14400,
          "end_sec": 14700,
          "start_time": "04:00:00",
          "end_time": "04:05:00",
          "count": 1
        },
        {
          "start_sec": 14700,
          "end_sec": 15000,
          "start_time": "04:05:00",
          "end_time": "04:10:00",
          "count": 1
        },
        {
          "start_sec": 15000,
          "end_sec": 15300,
          "start_time": "04:10:00",
          "end_time": "04:15:00",
          "count": 1
        },
        {
          "start_sec": 15300,
          "end_sec": 15600,
          "start_time": "04:15:00",
          "end_time": "04:20:00",
          "count": 0
        },
        {
          "start_sec": 15600,
          "end_sec": 15900,
          "start_time": "04:20:00",
          "end_time": "04:25:00",
          "count": 2
        },
        {
          "start_sec": 15900,
          "end_sec": 16200,
          "start_time": "04:25:00",
          "end_time": "04:30:00",
          "count": 1
        },
        {
          "start_sec": 16200,
          "end_sec": 16500,
          "start_time": "04:30:00",
          "end_time": "04:35:00",
          "count": 2
        },
        {
          "start_sec": 16500,
          "end_sec": 16800,
          "start_time": "04:35:00",
          "end_time": "04:40:00",
          "count": 2
        },
        {
          "start_sec": 16800,
          "end_sec": 17100,
          "start_time": "04:40:00",
          "end_time": "04:45:00",
          "count": 2
        },
        {
          "start_sec": 17100,
          "end_sec": 17400,
          "start_time": "04:45:00",
          "end_time": "04:50:00",
          "count": 2
        },
        {
          "start_sec": 17400,
          "end_sec": 17700,
          "start_time": "04:50:00",
          "end_time": "04:55:00",
          "count": 1
        },
        {
          "start_sec": 17700,
          "end_sec": 18000,
          "start_time": "04:55:00",
          "end_time": "05:00:00",
          "count": 4
        },
        {
          "start_sec": 18000,
          "end_sec": 18300,
          "start_time": "05:00:00",
          "end_time": "05:05:00",
          "count": 3
        },
        {
          "start_sec": 18300,
          "end_sec": 18600,
          "start_time": "05:05:00",
          "end_time": "05:10:00",
          "count": 1
        },
        {
          "start_sec": 18600,
          "end_sec": 18900,
          "start_time": "05:10:00",
          "end_time": "05:15:00",
          "count": 0
        },
        {
          "start_sec": 18900,
          "end_sec": 19200,
          "start_time": "05:15:00",
          "end_time": "05:20:00",
          "count": 3
        },
        {
          "start_sec": 19200,
          "end_sec": 19500,
          "start_time": "05:20:00",
          "end_time": "05:25:00",
          "count": 3
        },
        {
          "start_sec": 19500,
          "end_sec": 19800,
          "start_time": "05:25:00",
          "end_time": "05:30:00",
          "count": 0
        },
        {
          "start_sec": 19800,
          "end_sec": 20100,
          "start_time": "05:30:00",
          "end_time": "05:35:00",
          "count": 1
        },
        {
          "start_sec": 20100,
          "end_sec": 20400,
          "start_time": "05:35:00",
          "end_time": "05:40:00",
          "count": 0
        },
        {
          "start_sec": 20400,
          "end_sec": 20700,
          "start_time": "05:40:00",
          "end_time": "05:45:00",
          "count": 1
        },
        {
          "start_sec": 20700,
          "end_sec": 21000,
          "start_time": "05:45:00",
          "end_time": "05:50:00",
          "count": 1
        },
        {
          "start_sec": 21000,
          "end_sec": 21300,
          "start_time": "05:50:00",
          "end_time": "05:55:00",
          "count": 0
        },
        {
          "start_sec": 21300,
          "end_sec": 21600,
          "start_time": "05:55:00",
          "end_time": "06:00:00",
          "count": 1
        },
        {
          "start_sec": 21600,
          "end_sec": 21900,
          "start_time": "06:00:00",
          "end_time": "06:05:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        11153,
        12823,
        13340,
        14485,
        14914,
        15021,
        15723,
        15832,
        15928,
        16222,
        16234,
        16760,
        16795,
        16933,
        17060,
        17307,
        17321,
        17487,
        17755,
        17756,
        17803,
        17875,
        18038,
        18080,
        18263,
        18359,
        19086,
        19121,
        19173,
        19410,
        19481,
        19490,
        20077,
        20578,
        20873,
        21504
      ]
    },
    "2025_chiayi_twinlake_elite__全馬組__女B組": {
      "histogram_5min": [
        {
          "start_sec": 17100,
          "end_sec": 17400,
          "start_time": "04:45:00",
          "end_time": "04:50:00",
          "count": 1
        },
        {
          "start_sec": 17400,
          "end_sec": 17700,
          "start_time": "04:50:00",
          "end_time": "04:55:00",
          "count": 1
        },
        {
          "start_sec": 17700,
          "end_sec": 18000,
          "start_time": "04:55:00",
          "end_time": "05:00:00",
          "count": 1
        },
        {
          "start_sec": 18000,
          "end_sec": 18300,
          "start_time": "05:00:00",
          "end_time": "05:05:00",
          "count": 0
        },
        {
          "start_sec": 18300,
          "end_sec": 18600,
          "start_time": "05:05:00",
          "end_time": "05:10:00",
          "count": 0
        },
        {
          "start_sec": 18600,
          "end_sec": 18900,
          "start_time": "05:10:00",
          "end_time": "05:15:00",
          "count": 0
        },
        {
          "start_sec": 18900,
          "end_sec": 19200,
          "start_time": "05:15:00",
          "end_time": "05:20:00",
          "count": 1
        },
        {
          "start_sec": 19200,
          "end_sec": 19500,
          "start_time": "05:20:00",
          "end_time": "05:25:00",
          "count": 0
        },
        {
          "start_sec": 19500,
          "end_sec": 19800,
          "start_time": "05:25:00",
          "end_time": "05:30:00",
          "count": 0
        },
        {
          "start_sec": 19800,
          "end_sec": 20100,
          "start_time": "05:30:00",
          "end_time": "05:35:00",
          "count": 0
        },
        {
          "start_sec": 20100,
          "end_sec": 20400,
          "start_time": "05:35:00",
          "end_time": "05:40:00",
          "count": 0
        },
        {
          "start_sec": 20400,
          "end_sec": 20700,
          "start_time": "05:40:00",
          "end_time": "05:45:00",
          "count": 1
        },
        {
          "start_sec": 20700,
          "end_sec": 21000,
          "start_time": "05:45:00",
          "end_time": "05:50:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        17231,
        17457,
        17821,
        19166,
        20554
      ]
    },
    "2025_chiayi_twinlake_elite__半馬組__男F組": {
      "histogram_5min": [
        {
          "start_sec": 6000,
          "end_sec": 6300,
          "start_time": "01:40:00",
          "end_time": "01:45:00",
          "count": 1
        },
        {
          "start_sec": 6300,
          "end_sec": 6600,
          "start_time": "01:45:00",
          "end_time": "01:50:00",
          "count": 1
        },
        {
          "start_sec": 6600,
          "end_sec": 6900,
          "start_time": "01:50:00",
          "end_time": "01:55:00",
          "count": 0
        },
        {
          "start_sec": 6900,
          "end_sec": 7200,
          "start_time": "01:55:00",
          "end_time": "02:00:00",
          "count": 2
        },
        {
          "start_sec": 7200,
          "end_sec": 7500,
          "start_time": "02:00:00",
          "end_time": "02:05:00",
          "count": 1
        },
        {
          "start_sec": 7500,
          "end_sec": 7800,
          "start_time": "02:05:00",
          "end_time": "02:10:00",
          "count": 3
        },
        {
          "start_sec": 7800,
          "end_sec": 8100,
          "start_time": "02:10:00",
          "end_time": "02:15:00",
          "count": 0
        },
        {
          "start_sec": 8100,
          "end_sec": 8400,
          "start_time": "02:15:00",
          "end_time": "02:20:00",
          "count": 1
        },
        {
          "start_sec": 8400,
          "end_sec": 8700,
          "start_time": "02:20:00",
          "end_time": "02:25:00",
          "count": 4
        },
        {
          "start_sec": 8700,
          "end_sec": 9000,
          "start_time": "02:25:00",
          "end_time": "02:30:00",
          "count": 3
        },
        {
          "start_sec": 9000,
          "end_sec": 9300,
          "start_time": "02:30:00",
          "end_time": "02:35:00",
          "count": 2
        },
        {
          "start_sec": 9300,
          "end_sec": 9600,
          "start_time": "02:35:00",
          "end_time": "02:40:00",
          "count": 4
        },
        {
          "start_sec": 9600,
          "end_sec": 9900,
          "start_time": "02:40:00",
          "end_time": "02:45:00",
          "count": 0
        },
        {
          "start_sec": 9900,
          "end_sec": 10200,
          "start_time": "02:45:00",
          "end_time": "02:50:00",
          "count": 2
        },
        {
          "start_sec": 10200,
          "end_sec": 10500,
          "start_time": "02:50:00",
          "end_time": "02:55:00",
          "count": 2
        },
        {
          "start_sec": 10500,
          "end_sec": 10800,
          "start_time": "02:55:00",
          "end_time": "03:00:00",
          "count": 2
        },
        {
          "start_sec": 10800,
          "end_sec": 11100,
          "start_time": "03:00:00",
          "end_time": "03:05:00",
          "count": 2
        },
        {
          "start_sec": 11100,
          "end_sec": 11400,
          "start_time": "03:05:00",
          "end_time": "03:10:00",
          "count": 0
        },
        {
          "start_sec": 11400,
          "end_sec": 11700,
          "start_time": "03:10:00",
          "end_time": "03:15:00",
          "count": 2
        },
        {
          "start_sec": 11700,
          "end_sec": 12000,
          "start_time": "03:15:00",
          "end_time": "03:20:00",
          "count": 0
        },
        {
          "start_sec": 12000,
          "end_sec": 12300,
          "start_time": "03:20:00",
          "end_time": "03:25:00",
          "count": 1
        },
        {
          "start_sec": 12300,
          "end_sec": 12600,
          "start_time": "03:25:00",
          "end_time": "03:30:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        6038,
        6456,
        6903,
        6916,
        7391,
        7775,
        7777,
        7779,
        8105,
        8463,
        8467,
        8548,
        8613,
        8702,
        8811,
        8850,
        9013,
        9166,
        9395,
        9520,
        9580,
        9586,
        10031,
        10143,
        10235,
        10383,
        10520,
        10752,
        10889,
        10986,
        11570,
        11571,
        12027
      ]
    },
    "2025_chiayi_twinlake_elite__全馬組__男B組": {
      "histogram_5min": [
        {
          "start_sec": 9300,
          "end_sec": 9600,
          "start_time": "02:35:00",
          "end_time": "02:40:00",
          "count": 1
        },
        {
          "start_sec": 9600,
          "end_sec": 9900,
          "start_time": "02:40:00",
          "end_time": "02:45:00",
          "count": 0
        },
        {
          "start_sec": 9900,
          "end_sec": 10200,
          "start_time": "02:45:00",
          "end_time": "02:50:00",
          "count": 0
        },
        {
          "start_sec": 10200,
          "end_sec": 10500,
          "start_time": "02:50:00",
          "end_time": "02:55:00",
          "count": 0
        },
        {
          "start_sec": 10500,
          "end_sec": 10800,
          "start_time": "02:55:00",
          "end_time": "03:00:00",
          "count": 1
        },
        {
          "start_sec": 10800,
          "end_sec": 11100,
          "start_time": "03:00:00",
          "end_time": "03:05:00",
          "count": 0
        },
        {
          "start_sec": 11100,
          "end_sec": 11400,
          "start_time": "03:05:00",
          "end_time": "03:10:00",
          "count": 0
        },
        {
          "start_sec": 11400,
          "end_sec": 11700,
          "start_time": "03:10:00",
          "end_time": "03:15:00",
          "count": 0
        },
        {
          "start_sec": 11700,
          "end_sec": 12000,
          "start_time": "03:15:00",
          "end_time": "03:20:00",
          "count": 0
        },
        {
          "start_sec": 12000,
          "end_sec": 12300,
          "start_time": "03:20:00",
          "end_time": "03:25:00",
          "count": 0
        },
        {
          "start_sec": 12300,
          "end_sec": 12600,
          "start_time": "03:25:00",
          "end_time": "03:30:00",
          "count": 0
        },
        {
          "start_sec": 12600,
          "end_sec": 12900,
          "start_time": "03:30:00",
          "end_time": "03:35:00",
          "count": 0
        },
        {
          "start_sec": 12900,
          "end_sec": 13200,
          "start_time": "03:35:00",
          "end_time": "03:40:00",
          "count": 0
        },
        {
          "start_sec": 13200,
          "end_sec": 13500,
          "start_time": "03:40:00",
          "end_time": "03:45:00",
          "count": 0
        },
        {
          "start_sec": 13500,
          "end_sec": 13800,
          "start_time": "03:45:00",
          "end_time": "03:50:00",
          "count": 0
        },
        {
          "start_sec": 13800,
          "end_sec": 14100,
          "start_time": "03:50:00",
          "end_time": "03:55:00",
          "count": 0
        },
        {
          "start_sec": 14100,
          "end_sec": 14400,
          "start_time": "03:55:00",
          "end_time": "04:00:00",
          "count": 0
        },
        {
          "start_sec": 14400,
          "end_sec": 14700,
          "start_time": "04:00:00",
          "end_time": "04:05:00",
          "count": 0
        },
        {
          "start_sec": 14700,
          "end_sec": 15000,
          "start_time": "04:05:00",
          "end_time": "04:10:00",
          "count": 0
        },
        {
          "start_sec": 15000,
          "end_sec": 15300,
          "start_time": "04:10:00",
          "end_time": "04:15:00",
          "count": 1
        },
        {
          "start_sec": 15300,
          "end_sec": 15600,
          "start_time": "04:15:00",
          "end_time": "04:20:00",
          "count": 0
        },
        {
          "start_sec": 15600,
          "end_sec": 15900,
          "start_time": "04:20:00",
          "end_time": "04:25:00",
          "count": 0
        },
        {
          "start_sec": 15900,
          "end_sec": 16200,
          "start_time": "04:25:00",
          "end_time": "04:30:00",
          "count": 1
        },
        {
          "start_sec": 16200,
          "end_sec": 16500,
          "start_time": "04:30:00",
          "end_time": "04:35:00",
          "count": 0
        },
        {
          "start_sec": 16500,
          "end_sec": 16800,
          "start_time": "04:35:00",
          "end_time": "04:40:00",
          "count": 0
        },
        {
          "start_sec": 16800,
          "end_sec": 17100,
          "start_time": "04:40:00",
          "end_time": "04:45:00",
          "count": 1
        },
        {
          "start_sec": 17100,
          "end_sec": 17400,
          "start_time": "04:45:00",
          "end_time": "04:50:00",
          "count": 0
        },
        {
          "start_sec": 17400,
          "end_sec": 17700,
          "start_time": "04:50:00",
          "end_time": "04:55:00",
          "count": 0
        },
        {
          "start_sec": 17700,
          "end_sec": 18000,
          "start_time": "04:55:00",
          "end_time": "05:00:00",
          "count": 1
        },
        {
          "start_sec": 18000,
          "end_sec": 18300,
          "start_time": "05:00:00",
          "end_time": "05:05:00",
          "count": 1
        },
        {
          "start_sec": 18300,
          "end_sec": 18600,
          "start_time": "05:05:00",
          "end_time": "05:10:00",
          "count": 0
        },
        {
          "start_sec": 18600,
          "end_sec": 18900,
          "start_time": "05:10:00",
          "end_time": "05:15:00",
          "count": 1
        },
        {
          "start_sec": 18900,
          "end_sec": 19200,
          "start_time": "05:15:00",
          "end_time": "05:20:00",
          "count": 0
        },
        {
          "start_sec": 19200,
          "end_sec": 19500,
          "start_time": "05:20:00",
          "end_time": "05:25:00",
          "count": 0
        },
        {
          "start_sec": 19500,
          "end_sec": 19800,
          "start_time": "05:25:00",
          "end_time": "05:30:00",
          "count": 1
        },
        {
          "start_sec": 19800,
          "end_sec": 20100,
          "start_time": "05:30:00",
          "end_time": "05:35:00",
          "count": 2
        },
        {
          "start_sec": 20100,
          "end_sec": 20400,
          "start_time": "05:35:00",
          "end_time": "05:40:00",
          "count": 0
        },
        {
          "start_sec": 20400,
          "end_sec": 20700,
          "start_time": "05:40:00",
          "end_time": "05:45:00",
          "count": 1
        },
        {
          "start_sec": 20700,
          "end_sec": 21000,
          "start_time": "05:45:00",
          "end_time": "05:50:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        9377,
        10647,
        15285,
        16137,
        16826,
        17821,
        18011,
        18895,
        19759,
        19927,
        20045,
        20618
      ]
    },
    "2025_chiayi_twinlake_elite__半馬組__女A組": {
      "histogram_5min": [
        {
          "start_sec": 8100,
          "end_sec": 8400,
          "start_time": "02:15:00",
          "end_time": "02:20:00",
          "count": 1
        },
        {
          "start_sec": 8400,
          "end_sec": 8700,
          "start_time": "02:20:00",
          "end_time": "02:25:00",
          "count": 0
        },
        {
          "start_sec": 8700,
          "end_sec": 9000,
          "start_time": "02:25:00",
          "end_time": "02:30:00",
          "count": 0
        },
        {
          "start_sec": 9000,
          "end_sec": 9300,
          "start_time": "02:30:00",
          "end_time": "02:35:00",
          "count": 0
        },
        {
          "start_sec": 9300,
          "end_sec": 9600,
          "start_time": "02:35:00",
          "end_time": "02:40:00",
          "count": 0
        },
        {
          "start_sec": 9600,
          "end_sec": 9900,
          "start_time": "02:40:00",
          "end_time": "02:45:00",
          "count": 0
        },
        {
          "start_sec": 9900,
          "end_sec": 10200,
          "start_time": "02:45:00",
          "end_time": "02:50:00",
          "count": 0
        },
        {
          "start_sec": 10200,
          "end_sec": 10500,
          "start_time": "02:50:00",
          "end_time": "02:55:00",
          "count": 0
        },
        {
          "start_sec": 10500,
          "end_sec": 10800,
          "start_time": "02:55:00",
          "end_time": "03:00:00",
          "count": 1
        },
        {
          "start_sec": 10800,
          "end_sec": 11100,
          "start_time": "03:00:00",
          "end_time": "03:05:00",
          "count": 1
        },
        {
          "start_sec": 11100,
          "end_sec": 11400,
          "start_time": "03:05:00",
          "end_time": "03:10:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        8188,
        10557,
        11027
      ]
    },
    "2025_chiayi_twinlake_elite__半馬組__男G組": {
      "histogram_5min": [
        {
          "start_sec": 7800,
          "end_sec": 8100,
          "start_time": "02:10:00",
          "end_time": "02:15:00",
          "count": 1
        },
        {
          "start_sec": 8100,
          "end_sec": 8400,
          "start_time": "02:15:00",
          "end_time": "02:20:00",
          "count": 0
        },
        {
          "start_sec": 8400,
          "end_sec": 8700,
          "start_time": "02:20:00",
          "end_time": "02:25:00",
          "count": 0
        },
        {
          "start_sec": 8700,
          "end_sec": 9000,
          "start_time": "02:25:00",
          "end_time": "02:30:00",
          "count": 0
        },
        {
          "start_sec": 9000,
          "end_sec": 9300,
          "start_time": "02:30:00",
          "end_time": "02:35:00",
          "count": 0
        },
        {
          "start_sec": 9300,
          "end_sec": 9600,
          "start_time": "02:35:00",
          "end_time": "02:40:00",
          "count": 0
        },
        {
          "start_sec": 9600,
          "end_sec": 9900,
          "start_time": "02:40:00",
          "end_time": "02:45:00",
          "count": 0
        },
        {
          "start_sec": 9900,
          "end_sec": 10200,
          "start_time": "02:45:00",
          "end_time": "02:50:00",
          "count": 0
        },
        {
          "start_sec": 10200,
          "end_sec": 10500,
          "start_time": "02:50:00",
          "end_time": "02:55:00",
          "count": 0
        },
        {
          "start_sec": 10500,
          "end_sec": 10800,
          "start_time": "02:55:00",
          "end_time": "03:00:00",
          "count": 0
        },
        {
          "start_sec": 10800,
          "end_sec": 11100,
          "start_time": "03:00:00",
          "end_time": "03:05:00",
          "count": 0
        },
        {
          "start_sec": 11100,
          "end_sec": 11400,
          "start_time": "03:05:00",
          "end_time": "03:10:00",
          "count": 0
        },
        {
          "start_sec": 11400,
          "end_sec": 11700,
          "start_time": "03:10:00",
          "end_time": "03:15:00",
          "count": 1
        },
        {
          "start_sec": 11700,
          "end_sec": 12000,
          "start_time": "03:15:00",
          "end_time": "03:20:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        7829,
        11412
      ]
    },
    "2025_chiayi_twinlake_elite__半馬組__男D組": {
      "histogram_5min": [
        {
          "start_sec": 4200,
          "end_sec": 4500,
          "start_time": "01:10:00",
          "end_time": "01:15:00",
          "count": 2
        },
        {
          "start_sec": 4500,
          "end_sec": 4800,
          "start_time": "01:15:00",
          "end_time": "01:20:00",
          "count": 2
        },
        {
          "start_sec": 4800,
          "end_sec": 5100,
          "start_time": "01:20:00",
          "end_time": "01:25:00",
          "count": 0
        },
        {
          "start_sec": 5100,
          "end_sec": 5400,
          "start_time": "01:25:00",
          "end_time": "01:30:00",
          "count": 2
        },
        {
          "start_sec": 5400,
          "end_sec": 5700,
          "start_time": "01:30:00",
          "end_time": "01:35:00",
          "count": 3
        },
        {
          "start_sec": 5700,
          "end_sec": 6000,
          "start_time": "01:35:00",
          "end_time": "01:40:00",
          "count": 2
        },
        {
          "start_sec": 6000,
          "end_sec": 6300,
          "start_time": "01:40:00",
          "end_time": "01:45:00",
          "count": 7
        },
        {
          "start_sec": 6300,
          "end_sec": 6600,
          "start_time": "01:45:00",
          "end_time": "01:50:00",
          "count": 3
        },
        {
          "start_sec": 6600,
          "end_sec": 6900,
          "start_time": "01:50:00",
          "end_time": "01:55:00",
          "count": 6
        },
        {
          "start_sec": 6900,
          "end_sec": 7200,
          "start_time": "01:55:00",
          "end_time": "02:00:00",
          "count": 12
        },
        {
          "start_sec": 7200,
          "end_sec": 7500,
          "start_time": "02:00:00",
          "end_time": "02:05:00",
          "count": 9
        },
        {
          "start_sec": 7500,
          "end_sec": 7800,
          "start_time": "02:05:00",
          "end_time": "02:10:00",
          "count": 11
        },
        {
          "start_sec": 7800,
          "end_sec": 8100,
          "start_time": "02:10:00",
          "end_time": "02:15:00",
          "count": 13
        },
        {
          "start_sec": 8100,
          "end_sec": 8400,
          "start_time": "02:15:00",
          "end_time": "02:20:00",
          "count": 9
        },
        {
          "start_sec": 8400,
          "end_sec": 8700,
          "start_time": "02:20:00",
          "end_time": "02:25:00",
          "count": 13
        },
        {
          "start_sec": 8700,
          "end_sec": 9000,
          "start_time": "02:25:00",
          "end_time": "02:30:00",
          "count": 8
        },
        {
          "start_sec": 9000,
          "end_sec": 9300,
          "start_time": "02:30:00",
          "end_time": "02:35:00",
          "count": 7
        },
        {
          "start_sec": 9300,
          "end_sec": 9600,
          "start_time": "02:35:00",
          "end_time": "02:40:00",
          "count": 10
        },
        {
          "start_sec": 9600,
          "end_sec": 9900,
          "start_time": "02:40:00",
          "end_time": "02:45:00",
          "count": 4
        },
        {
          "start_sec": 9900,
          "end_sec": 10200,
          "start_time": "02:45:00",
          "end_time": "02:50:00",
          "count": 2
        },
        {
          "start_sec": 10200,
          "end_sec": 10500,
          "start_time": "02:50:00",
          "end_time": "02:55:00",
          "count": 2
        },
        {
          "start_sec": 10500,
          "end_sec": 10800,
          "start_time": "02:55:00",
          "end_time": "03:00:00",
          "count": 4
        },
        {
          "start_sec": 10800,
          "end_sec": 11100,
          "start_time": "03:00:00",
          "end_time": "03:05:00",
          "count": 1
        },
        {
          "start_sec": 11100,
          "end_sec": 11400,
          "start_time": "03:05:00",
          "end_time": "03:10:00",
          "count": 2
        },
        {
          "start_sec": 11400,
          "end_sec": 11700,
          "start_time": "03:10:00",
          "end_time": "03:15:00",
          "count": 2
        },
        {
          "start_sec": 11700,
          "end_sec": 12000,
          "start_time": "03:15:00",
          "end_time": "03:20:00",
          "count": 0
        },
        {
          "start_sec": 12000,
          "end_sec": 12300,
          "start_time": "03:20:00",
          "end_time": "03:25:00",
          "count": 2
        },
        {
          "start_sec": 12300,
          "end_sec": 12600,
          "start_time": "03:25:00",
          "end_time": "03:30:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        4279,
        4473,
        4672,
        4759,
        5207,
        5305,
        5471,
        5490,
        5563,
        5828,
        5980,
        6028,
        6122,
        6138,
        6142,
        6143,
        6230,
        6289,
        6324,
        6427,
        6563,
        6601,
        6668,
        6724,
        6755,
        6824,
        6852,
        6951,
        6951,
        6998,
        7002,
        7060,
        7081,
        7149,
        7150,
        7185,
        7196,
        7197,
        7198,
        7219,
        7254,
        7291,
        7301,
        7304,
        7319,
        7324,
        7368,
        7488,
        7518,
        7543,
        7582,
        7582,
        7627,
        7655,
        7669,
        7685,
        7688,
        7692,
        7699,
        7802,
        7841,
        7876,
        7879,
        7893,
        7913,
        7919,
        7939,
        7992,
        7994,
        8007,
        8013,
        8040,
        8106,
        8134,
        8267,
        8295,
        8301,
        8384,
        8385,
        8388,
        8393,
        8409,
        8415,
        8420,
        8426,
        8562,
        8562,
        8596,
        8598,
        8618,
        8644,
        8653,
        8657,
        8683,
        8720,
        8722,
        8728,
        8850,
        8862,
        8926,
        8952,
        8990,
        9013,
        9030,
        9106,
        9122,
        9157,
        9159,
        9293,
        9308,
        9353,
        9374,
        9379,
        9396,
        9543,
        9558,
        9560,
        9588,
        9593,
        9655,
        9787,
        9805,
        9861,
        9983,
        10054,
        10229,
        10246,
        10515,
        10557,
        10675,
        10701,
        10825,
        11155,
        11389,
        11551,
        11618,
        12207,
        12215
      ]
    },
    "2025_chiayi_twinlake_elite__全馬組__女E組": {
      "histogram_5min": [
        {
          "start_sec": 12000,
          "end_sec": 12300,
          "start_time": "03:20:00",
          "end_time": "03:25:00",
          "count": 1
        },
        {
          "start_sec": 12300,
          "end_sec": 12600,
          "start_time": "03:25:00",
          "end_time": "03:30:00",
          "count": 0
        },
        {
          "start_sec": 12600,
          "end_sec": 12900,
          "start_time": "03:30:00",
          "end_time": "03:35:00",
          "count": 0
        },
        {
          "start_sec": 12900,
          "end_sec": 13200,
          "start_time": "03:35:00",
          "end_time": "03:40:00",
          "count": 0
        },
        {
          "start_sec": 13200,
          "end_sec": 13500,
          "start_time": "03:40:00",
          "end_time": "03:45:00",
          "count": 0
        },
        {
          "start_sec": 13500,
          "end_sec": 13800,
          "start_time": "03:45:00",
          "end_time": "03:50:00",
          "count": 1
        },
        {
          "start_sec": 13800,
          "end_sec": 14100,
          "start_time": "03:50:00",
          "end_time": "03:55:00",
          "count": 0
        },
        {
          "start_sec": 14100,
          "end_sec": 14400,
          "start_time": "03:55:00",
          "end_time": "04:00:00",
          "count": 0
        },
        {
          "start_sec": 14400,
          "end_sec": 14700,
          "start_time": "04:00:00",
          "end_time": "04:05:00",
          "count": 0
        },
        {
          "start_sec": 14700,
          "end_sec": 15000,
          "start_time": "04:05:00",
          "end_time": "04:10:00",
          "count": 0
        },
        {
          "start_sec": 15000,
          "end_sec": 15300,
          "start_time": "04:10:00",
          "end_time": "04:15:00",
          "count": 0
        },
        {
          "start_sec": 15300,
          "end_sec": 15600,
          "start_time": "04:15:00",
          "end_time": "04:20:00",
          "count": 0
        },
        {
          "start_sec": 15600,
          "end_sec": 15900,
          "start_time": "04:20:00",
          "end_time": "04:25:00",
          "count": 0
        },
        {
          "start_sec": 15900,
          "end_sec": 16200,
          "start_time": "04:25:00",
          "end_time": "04:30:00",
          "count": 0
        },
        {
          "start_sec": 16200,
          "end_sec": 16500,
          "start_time": "04:30:00",
          "end_time": "04:35:00",
          "count": 0
        },
        {
          "start_sec": 16500,
          "end_sec": 16800,
          "start_time": "04:35:00",
          "end_time": "04:40:00",
          "count": 1
        },
        {
          "start_sec": 16800,
          "end_sec": 17100,
          "start_time": "04:40:00",
          "end_time": "04:45:00",
          "count": 0
        },
        {
          "start_sec": 17100,
          "end_sec": 17400,
          "start_time": "04:45:00",
          "end_time": "04:50:00",
          "count": 0
        },
        {
          "start_sec": 17400,
          "end_sec": 17700,
          "start_time": "04:50:00",
          "end_time": "04:55:00",
          "count": 0
        },
        {
          "start_sec": 17700,
          "end_sec": 18000,
          "start_time": "04:55:00",
          "end_time": "05:00:00",
          "count": 0
        },
        {
          "start_sec": 18000,
          "end_sec": 18300,
          "start_time": "05:00:00",
          "end_time": "05:05:00",
          "count": 1
        },
        {
          "start_sec": 18300,
          "end_sec": 18600,
          "start_time": "05:05:00",
          "end_time": "05:10:00",
          "count": 0
        },
        {
          "start_sec": 18600,
          "end_sec": 18900,
          "start_time": "05:10:00",
          "end_time": "05:15:00",
          "count": 0
        },
        {
          "start_sec": 18900,
          "end_sec": 19200,
          "start_time": "05:15:00",
          "end_time": "05:20:00",
          "count": 0
        },
        {
          "start_sec": 19200,
          "end_sec": 19500,
          "start_time": "05:20:00",
          "end_time": "05:25:00",
          "count": 0
        },
        {
          "start_sec": 19500,
          "end_sec": 19800,
          "start_time": "05:25:00",
          "end_time": "05:30:00",
          "count": 0
        },
        {
          "start_sec": 19800,
          "end_sec": 20100,
          "start_time": "05:30:00",
          "end_time": "05:35:00",
          "count": 0
        },
        {
          "start_sec": 20100,
          "end_sec": 20400,
          "start_time": "05:35:00",
          "end_time": "05:40:00",
          "count": 0
        },
        {
          "start_sec": 20400,
          "end_sec": 20700,
          "start_time": "05:40:00",
          "end_time": "05:45:00",
          "count": 0
        },
        {
          "start_sec": 20700,
          "end_sec": 21000,
          "start_time": "05:45:00",
          "end_time": "05:50:00",
          "count": 2
        },
        {
          "start_sec": 21000,
          "end_sec": 21300,
          "start_time": "05:50:00",
          "end_time": "05:55:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        12285,
        13776,
        16746,
        18162,
        20922,
        20995
      ]
    },
    "2025_chiayi_twinlake_elite__半馬組__女E組": {
      "histogram_5min": [
        {
          "start_sec": 5400,
          "end_sec": 5700,
          "start_time": "01:30:00",
          "end_time": "01:35:00",
          "count": 1
        },
        {
          "start_sec": 5700,
          "end_sec": 6000,
          "start_time": "01:35:00",
          "end_time": "01:40:00",
          "count": 0
        },
        {
          "start_sec": 6000,
          "end_sec": 6300,
          "start_time": "01:40:00",
          "end_time": "01:45:00",
          "count": 0
        },
        {
          "start_sec": 6300,
          "end_sec": 6600,
          "start_time": "01:45:00",
          "end_time": "01:50:00",
          "count": 0
        },
        {
          "start_sec": 6600,
          "end_sec": 6900,
          "start_time": "01:50:00",
          "end_time": "01:55:00",
          "count": 1
        },
        {
          "start_sec": 6900,
          "end_sec": 7200,
          "start_time": "01:55:00",
          "end_time": "02:00:00",
          "count": 1
        },
        {
          "start_sec": 7200,
          "end_sec": 7500,
          "start_time": "02:00:00",
          "end_time": "02:05:00",
          "count": 0
        },
        {
          "start_sec": 7500,
          "end_sec": 7800,
          "start_time": "02:05:00",
          "end_time": "02:10:00",
          "count": 0
        },
        {
          "start_sec": 7800,
          "end_sec": 8100,
          "start_time": "02:10:00",
          "end_time": "02:15:00",
          "count": 1
        },
        {
          "start_sec": 8100,
          "end_sec": 8400,
          "start_time": "02:15:00",
          "end_time": "02:20:00",
          "count": 0
        },
        {
          "start_sec": 8400,
          "end_sec": 8700,
          "start_time": "02:20:00",
          "end_time": "02:25:00",
          "count": 4
        },
        {
          "start_sec": 8700,
          "end_sec": 9000,
          "start_time": "02:25:00",
          "end_time": "02:30:00",
          "count": 1
        },
        {
          "start_sec": 9000,
          "end_sec": 9300,
          "start_time": "02:30:00",
          "end_time": "02:35:00",
          "count": 2
        },
        {
          "start_sec": 9300,
          "end_sec": 9600,
          "start_time": "02:35:00",
          "end_time": "02:40:00",
          "count": 0
        },
        {
          "start_sec": 9600,
          "end_sec": 9900,
          "start_time": "02:40:00",
          "end_time": "02:45:00",
          "count": 0
        },
        {
          "start_sec": 9900,
          "end_sec": 10200,
          "start_time": "02:45:00",
          "end_time": "02:50:00",
          "count": 1
        },
        {
          "start_sec": 10200,
          "end_sec": 10500,
          "start_time": "02:50:00",
          "end_time": "02:55:00",
          "count": 2
        },
        {
          "start_sec": 10500,
          "end_sec": 10800,
          "start_time": "02:55:00",
          "end_time": "03:00:00",
          "count": 1
        },
        {
          "start_sec": 10800,
          "end_sec": 11100,
          "start_time": "03:00:00",
          "end_time": "03:05:00",
          "count": 6
        },
        {
          "start_sec": 11100,
          "end_sec": 11400,
          "start_time": "03:05:00",
          "end_time": "03:10:00",
          "count": 2
        },
        {
          "start_sec": 11400,
          "end_sec": 11700,
          "start_time": "03:10:00",
          "end_time": "03:15:00",
          "count": 1
        },
        {
          "start_sec": 11700,
          "end_sec": 12000,
          "start_time": "03:15:00",
          "end_time": "03:20:00",
          "count": 0
        },
        {
          "start_sec": 12000,
          "end_sec": 12300,
          "start_time": "03:20:00",
          "end_time": "03:25:00",
          "count": 0
        },
        {
          "start_sec": 12300,
          "end_sec": 12600,
          "start_time": "03:25:00",
          "end_time": "03:30:00",
          "count": 1
        },
        {
          "start_sec": 12600,
          "end_sec": 12900,
          "start_time": "03:30:00",
          "end_time": "03:35:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        5584,
        6834,
        7096,
        7807,
        8434,
        8467,
        8593,
        8669,
        8882,
        9061,
        9212,
        9930,
        10290,
        10353,
        10593,
        10912,
        10927,
        10999,
        11013,
        11036,
        11085,
        11124,
        11394,
        11479,
        12428
      ]
    },
    "2025_chiayi_twinlake_elite__半馬組__ALL": {
      "histogram_5min": [
        {
          "start_sec": 3900,
          "end_sec": 4200,
          "start_time": "01:05:00",
          "end_time": "01:10:00",
          "count": 2
        },
        {
          "start_sec": 4200,
          "end_sec": 4500,
          "start_time": "01:10:00",
          "end_time": "01:15:00",
          "count": 4
        },
        {
          "start_sec": 4500,
          "end_sec": 4800,
          "start_time": "01:15:00",
          "end_time": "01:20:00",
          "count": 3
        },
        {
          "start_sec": 4800,
          "end_sec": 5100,
          "start_time": "01:20:00",
          "end_time": "01:25:00",
          "count": 7
        },
        {
          "start_sec": 5100,
          "end_sec": 5400,
          "start_time": "01:25:00",
          "end_time": "01:30:00",
          "count": 7
        },
        {
          "start_sec": 5400,
          "end_sec": 5700,
          "start_time": "01:30:00",
          "end_time": "01:35:00",
          "count": 12
        },
        {
          "start_sec": 5700,
          "end_sec": 6000,
          "start_time": "01:35:00",
          "end_time": "01:40:00",
          "count": 13
        },
        {
          "start_sec": 6000,
          "end_sec": 6300,
          "start_time": "01:40:00",
          "end_time": "01:45:00",
          "count": 23
        },
        {
          "start_sec": 6300,
          "end_sec": 6600,
          "start_time": "01:45:00",
          "end_time": "01:50:00",
          "count": 20
        },
        {
          "start_sec": 6600,
          "end_sec": 6900,
          "start_time": "01:50:00",
          "end_time": "01:55:00",
          "count": 29
        },
        {
          "start_sec": 6900,
          "end_sec": 7200,
          "start_time": "01:55:00",
          "end_time": "02:00:00",
          "count": 36
        },
        {
          "start_sec": 7200,
          "end_sec": 7500,
          "start_time": "02:00:00",
          "end_time": "02:05:00",
          "count": 30
        },
        {
          "start_sec": 7500,
          "end_sec": 7800,
          "start_time": "02:05:00",
          "end_time": "02:10:00",
          "count": 42
        },
        {
          "start_sec": 7800,
          "end_sec": 8100,
          "start_time": "02:10:00",
          "end_time": "02:15:00",
          "count": 46
        },
        {
          "start_sec": 8100,
          "end_sec": 8400,
          "start_time": "02:15:00",
          "end_time": "02:20:00",
          "count": 40
        },
        {
          "start_sec": 8400,
          "end_sec": 8700,
          "start_time": "02:20:00",
          "end_time": "02:25:00",
          "count": 48
        },
        {
          "start_sec": 8700,
          "end_sec": 9000,
          "start_time": "02:25:00",
          "end_time": "02:30:00",
          "count": 34
        },
        {
          "start_sec": 9000,
          "end_sec": 9300,
          "start_time": "02:30:00",
          "end_time": "02:35:00",
          "count": 38
        },
        {
          "start_sec": 9300,
          "end_sec": 9600,
          "start_time": "02:35:00",
          "end_time": "02:40:00",
          "count": 33
        },
        {
          "start_sec": 9600,
          "end_sec": 9900,
          "start_time": "02:40:00",
          "end_time": "02:45:00",
          "count": 34
        },
        {
          "start_sec": 9900,
          "end_sec": 10200,
          "start_time": "02:45:00",
          "end_time": "02:50:00",
          "count": 23
        },
        {
          "start_sec": 10200,
          "end_sec": 10500,
          "start_time": "02:50:00",
          "end_time": "02:55:00",
          "count": 27
        },
        {
          "start_sec": 10500,
          "end_sec": 10800,
          "start_time": "02:55:00",
          "end_time": "03:00:00",
          "count": 25
        },
        {
          "start_sec": 10800,
          "end_sec": 11100,
          "start_time": "03:00:00",
          "end_time": "03:05:00",
          "count": 20
        },
        {
          "start_sec": 11100,
          "end_sec": 11400,
          "start_time": "03:05:00",
          "end_time": "03:10:00",
          "count": 19
        },
        {
          "start_sec": 11400,
          "end_sec": 11700,
          "start_time": "03:10:00",
          "end_time": "03:15:00",
          "count": 19
        },
        {
          "start_sec": 11700,
          "end_sec": 12000,
          "start_time": "03:15:00",
          "end_time": "03:20:00",
          "count": 8
        },
        {
          "start_sec": 12000,
          "end_sec": 12300,
          "start_time": "03:20:00",
          "end_time": "03:25:00",
          "count": 15
        },
        {
          "start_sec": 12300,
          "end_sec": 12600,
          "start_time": "03:25:00",
          "end_time": "03:30:00",
          "count": 5
        },
        {
          "start_sec": 12600,
          "end_sec": 12900,
          "start_time": "03:30:00",
          "end_time": "03:35:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        4056,
        4064,
        4278,
        4279,
        4473,
        4482,
        4671,
        4672,
        4759,
        4881,
        4992,
        4997,
        5022,
        5048,
        5049,
        5098,
        5207,
        5207,
        5305,
        5359,
        5365,
        5365,
        5398,
        5471,
        5490,
        5506,
        5526,
        5540,
        5541,
        5563,
        5572,
        5584,
        5628,
        5680,
        5689,
        5706,
        5707,
        5730,
        5807,
        5819,
        5828,
        5834,
        5840,
        5913,
        5970,
        5980,
        5985,
        5987,
        6028,
        6028,
        6035,
        6036,
        6038,
        6102,
        6118,
        6122,
        6138,
        6142,
        6143,
        6162,
        6169,
        6170,
        6178,
        6203,
        6204,
        6211,
        6225,
        6230,
        6237,
        6289,
        6290,
        6320,
        6324,
        6362,
        6363,
        6382,
        6402,
        6427,
        6430,
        6456,
        6458,
        6465,
        6470,
        6479,
        6492,
        6494,
        6496,
        6530,
        6543,
        6563,
        6591,
        6601,
        6604,
        6633,
        6639,
        6642,
        6647,
        6663,
        6667,
        6668,
        6715,
        6724,
        6733,
        6742,
        6755,
        6761,
        6767,
        6769,
        6790,
        6804,
        6810,
        6813,
        6814,
        6824,
        6828,
        6834,
        6844,
        6852,
        6880,
        6894,
        6900,
        6903,
        6916,
        6925,
        6943,
        6949,
        6951,
        6951,
        6959,
        6972,
        6992,
        6998,
        7002,
        7011,
        7015,
        7026,
        7034,
        7042,
        7054,
        7060,
        7065,
        7076,
        7076,
        7081,
        7096,
        7135,
        7149,
        7150,
        7151,
        7156,
        7160,
        7185,
        7196,
        7197,
        7197,
        7198,
        7204,
        7205,
        7207,
        7219,
        7231,
        7235,
        7254,
        7260,
        7283,
        7291,
        7301,
        7304,
        7319,
        7324,
        7344,
        7353,
        7356,
        7368,
        7391,
        7398,
        7399,
        7418,
        7423,
        7433,
        7442,
        7447,
        7453,
        7476,
        7477,
        7488,
        7502,
        7518,
        7529,
        7536,
        7538,
        7543,
        7548,
        7559,
        7572,
        7581,
        7582,
        7582,
        7589,
        7627,
        7629,
        7641,
        7645,
        7649,
        7655,
        7669,
        7669,
        7681,
        7685,
        7688,
        7691,
        7692,
        7699,
        7705,
        7709,
        7737,
        7739,
        7740,
        7752,
        7760,
        7761,
        7772,
        7773,
        7775,
        7777,
        7777,
        7779,
        7792,
        7802,
        7807,
        7814,
        7819,
        7823,
        7828,
        7829,
        7841,
        7854,
        7876,
        7876,
        7877,
        7879,
        7893,
        7902,
        7906,
        7913,
        7919,
        7931,
        7937,
        7939,
        7947,
        7951,
        7953,
        7962,
        7963,
        7973,
        7985,
        7992,
        7994,
        7997,
        7998,
        8001,
        8003,
        8007,
        8010,
        8013,
        8022,
        8028,
        8035,
        8040,
        8045,
        8056,
        8059,
        8063,
        8092,
        8105,
        8106,
        8112,
        8128,
        8134,
        8147,
        8166,
        8167,
        8168,
        8176,
        8188,
        8201,
        8208,
        8209,
        8217,
        8221,
        8228,
        8228,
        8237,
        8257,
        8259,
        8266,
        8267,
        8276,
        8280,
        8281,
        8295,
        8301,
        8304,
        8306,
        8312,
        8315,
        8320,
        8323,
        8339,
        8362,
        8384,
        8385,
        8388,
        8393,
        8404,
        8409,
        8412,
        8415,
        8420,
        8426,
        8434,
        8442,
        8463,
        8464,
        8466,
        8467,
        8467,
        8510,
        8516,
        8518,
        8520,
        8540,
        8548,
        8562,
        8562,
        8563,
        8569,
        8569,
        8571,
        8575,
        8579,
        8581,
        8593,
        8595,
        8596,
        8598,
        8599,
        8601,
        8613,
        8613,
        8615,
        8618,
        8632,
        8643,
        8644,
        8653,
        8657,
        8669,
        8683,
        8684,
        8693,
        8697,
        8702,
        8718,
        8719,
        8720,
        8722,
        8728,
        8729,
        8731,
        8749,
        8753,
        8774,
        8798,
        8802,
        8811,
        8843,
        8843,
        8844,
        8844,
        8850,
        8850,
        8862,
        8865,
        8882,
        8891,
        8903,
        8906,
        8915,
        8916,
        8926,
        8952,
        8963,
        8990,
        8993,
        8995,
        9000,
        9013,
        9013,
        9030,
        9033,
        9035,
        9055,
        9055,
        9055,
        9057,
        9061,
        9066,
        9082,
        9084,
        9096,
        9098,
        9106,
        9106,
        9122,
        9123,
        9135,
        9157,
        9159,
        9166,
        9167,
        9194,
        9199,
        9202,
        9205,
        9212,
        9218,
        9221,
        9221,
        9230,
        9239,
        9241,
        9274,
        9293,
        9308,
        9313,
        9353,
        9358,
        9374,
        9379,
        9392,
        9393,
        9393,
        9395,
        9396,
        9403,
        9417,
        9455,
        9478,
        9485,
        9493,
        9498,
        9520,
        9520,
        9543,
        9549,
        9558,
        9560,
        9569,
        9578,
        9578,
        9580,
        9583,
        9586,
        9588,
        9593,
        9594,
        9625,
        9625,
        9626,
        9628,
        9640,
        9655,
        9657,
        9670,
        9683,
        9691,
        9696,
        9715,
        9725,
        9737,
        9759,
        9760,
        9765,
        9776,
        9777,
        9787,
        9805,
        9813,
        9813,
        9813,
        9848,
        9861,
        9865,
        9865,
        9878,
        9882,
        9883,
        9883,
        9897,
        9897,
        9930,
        9972,
        9973,
        9975,
        9983,
        9997,
        10026,
        10031,
        10032,
        10037,
        10041,
        10052,
        10054,
        10074,
        10077,
        10121,
        10121,
        10143,
        10154,
        10154,
        10173,
        10185,
        10189,
        10208,
        10211,
        10212,
        10229,
        10231,
        10235,
        10246,
        10251,
        10252,
        10290,
        10299,
        10322,
        10324,
        10324,
        10334,
        10353,
        10354,
        10355,
        10383,
        10415,
        10430,
        10455,
        10460,
        10465,
        10473,
        10484,
        10487,
        10510,
        10515,
        10520,
        10524,
        10550,
        10557,
        10557,
        10564,
        10565,
        10593,
        10623,
        10623,
        10633,
        10648,
        10653,
        10671,
        10675,
        10677,
        10678,
        10679,
        10679,
        10681,
        10701,
        10708,
        10752,
        10825,
        10831,
        10851,
        10860,
        10862,
        10889,
        10910,
        10912,
        10915,
        10927,
        10930,
        10933,
        10986,
        10999,
        11013,
        11027,
        11036,
        11064,
        11085,
        11085,
        11124,
        11133,
        11143,
        11155,
        11190,
        11212,
        11217,
        11218,
        11243,
        11247,
        11250,
        11282,
        11321,
        11322,
        11377,
        11380,
        11387,
        11389,
        11394,
        11412,
        11420,
        11442,
        11460,
        11479,
        11485,
        11489,
        11522,
        11533,
        11551,
        11557,
        11570,
        11571,
        11618,
        11627,
        11627,
        11636,
        11652,
        11653,
        11751,
        11764,
        11776,
        11913,
        11926,
        11948,
        11948,
        11955,
        12027,
        12035,
        12051,
        12115,
        12115,
        12148,
        12193,
        12203,
        12207,
        12209,
        12214,
        12215,
        12231,
        12233,
        12285,
        12361,
        12409,
        12416,
        12428,
        12558
      ]
    },
    "2025_chiayi_twinlake_elite__全馬組__女C組": {
      "histogram_5min": [
        {
          "start_sec": 9600,
          "end_sec": 9900,
          "start_time": "02:40:00",
          "end_time": "02:45:00",
          "count": 1
        },
        {
          "start_sec": 9900,
          "end_sec": 10200,
          "start_time": "02:45:00",
          "end_time": "02:50:00",
          "count": 0
        },
        {
          "start_sec": 10200,
          "end_sec": 10500,
          "start_time": "02:50:00",
          "end_time": "02:55:00",
          "count": 0
        },
        {
          "start_sec": 10500,
          "end_sec": 10800,
          "start_time": "02:55:00",
          "end_time": "03:00:00",
          "count": 0
        },
        {
          "start_sec": 10800,
          "end_sec": 11100,
          "start_time": "03:00:00",
          "end_time": "03:05:00",
          "count": 0
        },
        {
          "start_sec": 11100,
          "end_sec": 11400,
          "start_time": "03:05:00",
          "end_time": "03:10:00",
          "count": 2
        },
        {
          "start_sec": 11400,
          "end_sec": 11700,
          "start_time": "03:10:00",
          "end_time": "03:15:00",
          "count": 1
        },
        {
          "start_sec": 11700,
          "end_sec": 12000,
          "start_time": "03:15:00",
          "end_time": "03:20:00",
          "count": 0
        },
        {
          "start_sec": 12000,
          "end_sec": 12300,
          "start_time": "03:20:00",
          "end_time": "03:25:00",
          "count": 0
        },
        {
          "start_sec": 12300,
          "end_sec": 12600,
          "start_time": "03:25:00",
          "end_time": "03:30:00",
          "count": 0
        },
        {
          "start_sec": 12600,
          "end_sec": 12900,
          "start_time": "03:30:00",
          "end_time": "03:35:00",
          "count": 0
        },
        {
          "start_sec": 12900,
          "end_sec": 13200,
          "start_time": "03:35:00",
          "end_time": "03:40:00",
          "count": 0
        },
        {
          "start_sec": 13200,
          "end_sec": 13500,
          "start_time": "03:40:00",
          "end_time": "03:45:00",
          "count": 0
        },
        {
          "start_sec": 13500,
          "end_sec": 13800,
          "start_time": "03:45:00",
          "end_time": "03:50:00",
          "count": 0
        },
        {
          "start_sec": 13800,
          "end_sec": 14100,
          "start_time": "03:50:00",
          "end_time": "03:55:00",
          "count": 0
        },
        {
          "start_sec": 14100,
          "end_sec": 14400,
          "start_time": "03:55:00",
          "end_time": "04:00:00",
          "count": 1
        },
        {
          "start_sec": 14400,
          "end_sec": 14700,
          "start_time": "04:00:00",
          "end_time": "04:05:00",
          "count": 0
        },
        {
          "start_sec": 14700,
          "end_sec": 15000,
          "start_time": "04:05:00",
          "end_time": "04:10:00",
          "count": 0
        },
        {
          "start_sec": 15000,
          "end_sec": 15300,
          "start_time": "04:10:00",
          "end_time": "04:15:00",
          "count": 0
        },
        {
          "start_sec": 15300,
          "end_sec": 15600,
          "start_time": "04:15:00",
          "end_time": "04:20:00",
          "count": 0
        },
        {
          "start_sec": 15600,
          "end_sec": 15900,
          "start_time": "04:20:00",
          "end_time": "04:25:00",
          "count": 0
        },
        {
          "start_sec": 15900,
          "end_sec": 16200,
          "start_time": "04:25:00",
          "end_time": "04:30:00",
          "count": 0
        },
        {
          "start_sec": 16200,
          "end_sec": 16500,
          "start_time": "04:30:00",
          "end_time": "04:35:00",
          "count": 0
        },
        {
          "start_sec": 16500,
          "end_sec": 16800,
          "start_time": "04:35:00",
          "end_time": "04:40:00",
          "count": 0
        },
        {
          "start_sec": 16800,
          "end_sec": 17100,
          "start_time": "04:40:00",
          "end_time": "04:45:00",
          "count": 0
        },
        {
          "start_sec": 17100,
          "end_sec": 17400,
          "start_time": "04:45:00",
          "end_time": "04:50:00",
          "count": 0
        },
        {
          "start_sec": 17400,
          "end_sec": 17700,
          "start_time": "04:50:00",
          "end_time": "04:55:00",
          "count": 0
        },
        {
          "start_sec": 17700,
          "end_sec": 18000,
          "start_time": "04:55:00",
          "end_time": "05:00:00",
          "count": 0
        },
        {
          "start_sec": 18000,
          "end_sec": 18300,
          "start_time": "05:00:00",
          "end_time": "05:05:00",
          "count": 0
        },
        {
          "start_sec": 18300,
          "end_sec": 18600,
          "start_time": "05:05:00",
          "end_time": "05:10:00",
          "count": 0
        },
        {
          "start_sec": 18600,
          "end_sec": 18900,
          "start_time": "05:10:00",
          "end_time": "05:15:00",
          "count": 0
        },
        {
          "start_sec": 18900,
          "end_sec": 19200,
          "start_time": "05:15:00",
          "end_time": "05:20:00",
          "count": 0
        },
        {
          "start_sec": 19200,
          "end_sec": 19500,
          "start_time": "05:20:00",
          "end_time": "05:25:00",
          "count": 0
        },
        {
          "start_sec": 19500,
          "end_sec": 19800,
          "start_time": "05:25:00",
          "end_time": "05:30:00",
          "count": 1
        },
        {
          "start_sec": 19800,
          "end_sec": 20100,
          "start_time": "05:30:00",
          "end_time": "05:35:00",
          "count": 1
        },
        {
          "start_sec": 20100,
          "end_sec": 20400,
          "start_time": "05:35:00",
          "end_time": "05:40:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        9797,
        11316,
        11316,
        11632,
        14192,
        19701,
        19858
      ]
    },
    "2025_chiayi_twinlake_elite__全馬組__男D組": {
      "histogram_5min": [
        {
          "start_sec": 8400,
          "end_sec": 8700,
          "start_time": "02:20:00",
          "end_time": "02:25:00",
          "count": 1
        },
        {
          "start_sec": 8700,
          "end_sec": 9000,
          "start_time": "02:25:00",
          "end_time": "02:30:00",
          "count": 1
        },
        {
          "start_sec": 9000,
          "end_sec": 9300,
          "start_time": "02:30:00",
          "end_time": "02:35:00",
          "count": 2
        },
        {
          "start_sec": 9300,
          "end_sec": 9600,
          "start_time": "02:35:00",
          "end_time": "02:40:00",
          "count": 0
        },
        {
          "start_sec": 9600,
          "end_sec": 9900,
          "start_time": "02:40:00",
          "end_time": "02:45:00",
          "count": 0
        },
        {
          "start_sec": 9900,
          "end_sec": 10200,
          "start_time": "02:45:00",
          "end_time": "02:50:00",
          "count": 1
        },
        {
          "start_sec": 10200,
          "end_sec": 10500,
          "start_time": "02:50:00",
          "end_time": "02:55:00",
          "count": 0
        },
        {
          "start_sec": 10500,
          "end_sec": 10800,
          "start_time": "02:55:00",
          "end_time": "03:00:00",
          "count": 0
        },
        {
          "start_sec": 10800,
          "end_sec": 11100,
          "start_time": "03:00:00",
          "end_time": "03:05:00",
          "count": 1
        },
        {
          "start_sec": 11100,
          "end_sec": 11400,
          "start_time": "03:05:00",
          "end_time": "03:10:00",
          "count": 1
        },
        {
          "start_sec": 11400,
          "end_sec": 11700,
          "start_time": "03:10:00",
          "end_time": "03:15:00",
          "count": 3
        },
        {
          "start_sec": 11700,
          "end_sec": 12000,
          "start_time": "03:15:00",
          "end_time": "03:20:00",
          "count": 2
        },
        {
          "start_sec": 12000,
          "end_sec": 12300,
          "start_time": "03:20:00",
          "end_time": "03:25:00",
          "count": 0
        },
        {
          "start_sec": 12300,
          "end_sec": 12600,
          "start_time": "03:25:00",
          "end_time": "03:30:00",
          "count": 4
        },
        {
          "start_sec": 12600,
          "end_sec": 12900,
          "start_time": "03:30:00",
          "end_time": "03:35:00",
          "count": 2
        },
        {
          "start_sec": 12900,
          "end_sec": 13200,
          "start_time": "03:35:00",
          "end_time": "03:40:00",
          "count": 1
        },
        {
          "start_sec": 13200,
          "end_sec": 13500,
          "start_time": "03:40:00",
          "end_time": "03:45:00",
          "count": 4
        },
        {
          "start_sec": 13500,
          "end_sec": 13800,
          "start_time": "03:45:00",
          "end_time": "03:50:00",
          "count": 2
        },
        {
          "start_sec": 13800,
          "end_sec": 14100,
          "start_time": "03:50:00",
          "end_time": "03:55:00",
          "count": 3
        },
        {
          "start_sec": 14100,
          "end_sec": 14400,
          "start_time": "03:55:00",
          "end_time": "04:00:00",
          "count": 3
        },
        {
          "start_sec": 14400,
          "end_sec": 14700,
          "start_time": "04:00:00",
          "end_time": "04:05:00",
          "count": 3
        },
        {
          "start_sec": 14700,
          "end_sec": 15000,
          "start_time": "04:05:00",
          "end_time": "04:10:00",
          "count": 0
        },
        {
          "start_sec": 15000,
          "end_sec": 15300,
          "start_time": "04:10:00",
          "end_time": "04:15:00",
          "count": 1
        },
        {
          "start_sec": 15300,
          "end_sec": 15600,
          "start_time": "04:15:00",
          "end_time": "04:20:00",
          "count": 0
        },
        {
          "start_sec": 15600,
          "end_sec": 15900,
          "start_time": "04:20:00",
          "end_time": "04:25:00",
          "count": 1
        },
        {
          "start_sec": 15900,
          "end_sec": 16200,
          "start_time": "04:25:00",
          "end_time": "04:30:00",
          "count": 1
        },
        {
          "start_sec": 16200,
          "end_sec": 16500,
          "start_time": "04:30:00",
          "end_time": "04:35:00",
          "count": 4
        },
        {
          "start_sec": 16500,
          "end_sec": 16800,
          "start_time": "04:35:00",
          "end_time": "04:40:00",
          "count": 4
        },
        {
          "start_sec": 16800,
          "end_sec": 17100,
          "start_time": "04:40:00",
          "end_time": "04:45:00",
          "count": 2
        },
        {
          "start_sec": 17100,
          "end_sec": 17400,
          "start_time": "04:45:00",
          "end_time": "04:50:00",
          "count": 3
        },
        {
          "start_sec": 17400,
          "end_sec": 17700,
          "start_time": "04:50:00",
          "end_time": "04:55:00",
          "count": 1
        },
        {
          "start_sec": 17700,
          "end_sec": 18000,
          "start_time": "04:55:00",
          "end_time": "05:00:00",
          "count": 2
        },
        {
          "start_sec": 18000,
          "end_sec": 18300,
          "start_time": "05:00:00",
          "end_time": "05:05:00",
          "count": 0
        },
        {
          "start_sec": 18300,
          "end_sec": 18600,
          "start_time": "05:05:00",
          "end_time": "05:10:00",
          "count": 4
        },
        {
          "start_sec": 18600,
          "end_sec": 18900,
          "start_time": "05:10:00",
          "end_time": "05:15:00",
          "count": 2
        },
        {
          "start_sec": 18900,
          "end_sec": 19200,
          "start_time": "05:15:00",
          "end_time": "05:20:00",
          "count": 0
        },
        {
          "start_sec": 19200,
          "end_sec": 19500,
          "start_time": "05:20:00",
          "end_time": "05:25:00",
          "count": 0
        },
        {
          "start_sec": 19500,
          "end_sec": 19800,
          "start_time": "05:25:00",
          "end_time": "05:30:00",
          "count": 1
        },
        {
          "start_sec": 19800,
          "end_sec": 20100,
          "start_time": "05:30:00",
          "end_time": "05:35:00",
          "count": 3
        },
        {
          "start_sec": 20100,
          "end_sec": 20400,
          "start_time": "05:35:00",
          "end_time": "05:40:00",
          "count": 1
        },
        {
          "start_sec": 20400,
          "end_sec": 20700,
          "start_time": "05:40:00",
          "end_time": "05:45:00",
          "count": 1
        },
        {
          "start_sec": 20700,
          "end_sec": 21000,
          "start_time": "05:45:00",
          "end_time": "05:50:00",
          "count": 0
        },
        {
          "start_sec": 21000,
          "end_sec": 21300,
          "start_time": "05:50:00",
          "end_time": "05:55:00",
          "count": 1
        },
        {
          "start_sec": 21300,
          "end_sec": 21600,
          "start_time": "05:55:00",
          "end_time": "06:00:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        8493,
        8791,
        9149,
        9173,
        9994,
        10897,
        11312,
        11412,
        11613,
        11639,
        11767,
        11890,
        12322,
        12337,
        12406,
        12515,
        12724,
        12893,
        12901,
        13254,
        13316,
        13428,
        13487,
        13520,
        13695,
        14028,
        14057,
        14072,
        14152,
        14311,
        14392,
        14443,
        14456,
        14466,
        15139,
        15890,
        15971,
        16214,
        16219,
        16255,
        16463,
        16519,
        16676,
        16726,
        16755,
        16983,
        17068,
        17209,
        17226,
        17232,
        17510,
        17816,
        17880,
        18311,
        18359,
        18414,
        18464,
        18756,
        18800,
        19511,
        19878,
        19894,
        19968,
        20391,
        20431,
        21184
      ]
    },
    "2025_chiayi_twinlake_elite__半馬組__男C組": {
      "histogram_5min": [
        {
          "start_sec": 4200,
          "end_sec": 4500,
          "start_time": "01:10:00",
          "end_time": "01:15:00",
          "count": 1
        },
        {
          "start_sec": 4500,
          "end_sec": 4800,
          "start_time": "01:15:00",
          "end_time": "01:20:00",
          "count": 0
        },
        {
          "start_sec": 4800,
          "end_sec": 5100,
          "start_time": "01:20:00",
          "end_time": "01:25:00",
          "count": 3
        },
        {
          "start_sec": 5100,
          "end_sec": 5400,
          "start_time": "01:25:00",
          "end_time": "01:30:00",
          "count": 0
        },
        {
          "start_sec": 5400,
          "end_sec": 5700,
          "start_time": "01:30:00",
          "end_time": "01:35:00",
          "count": 3
        },
        {
          "start_sec": 5700,
          "end_sec": 6000,
          "start_time": "01:35:00",
          "end_time": "01:40:00",
          "count": 3
        },
        {
          "start_sec": 6000,
          "end_sec": 6300,
          "start_time": "01:40:00",
          "end_time": "01:45:00",
          "count": 5
        },
        {
          "start_sec": 6300,
          "end_sec": 6600,
          "start_time": "01:45:00",
          "end_time": "01:50:00",
          "count": 7
        },
        {
          "start_sec": 6600,
          "end_sec": 6900,
          "start_time": "01:50:00",
          "end_time": "01:55:00",
          "count": 8
        },
        {
          "start_sec": 6900,
          "end_sec": 7200,
          "start_time": "01:55:00",
          "end_time": "02:00:00",
          "count": 7
        },
        {
          "start_sec": 7200,
          "end_sec": 7500,
          "start_time": "02:00:00",
          "end_time": "02:05:00",
          "count": 5
        },
        {
          "start_sec": 7500,
          "end_sec": 7800,
          "start_time": "02:05:00",
          "end_time": "02:10:00",
          "count": 11
        },
        {
          "start_sec": 7800,
          "end_sec": 8100,
          "start_time": "02:10:00",
          "end_time": "02:15:00",
          "count": 10
        },
        {
          "start_sec": 8100,
          "end_sec": 8400,
          "start_time": "02:15:00",
          "end_time": "02:20:00",
          "count": 10
        },
        {
          "start_sec": 8400,
          "end_sec": 8700,
          "start_time": "02:20:00",
          "end_time": "02:25:00",
          "count": 5
        },
        {
          "start_sec": 8700,
          "end_sec": 9000,
          "start_time": "02:25:00",
          "end_time": "02:30:00",
          "count": 4
        },
        {
          "start_sec": 9000,
          "end_sec": 9300,
          "start_time": "02:30:00",
          "end_time": "02:35:00",
          "count": 4
        },
        {
          "start_sec": 9300,
          "end_sec": 9600,
          "start_time": "02:35:00",
          "end_time": "02:40:00",
          "count": 4
        },
        {
          "start_sec": 9600,
          "end_sec": 9900,
          "start_time": "02:40:00",
          "end_time": "02:45:00",
          "count": 8
        },
        {
          "start_sec": 9900,
          "end_sec": 10200,
          "start_time": "02:45:00",
          "end_time": "02:50:00",
          "count": 4
        },
        {
          "start_sec": 10200,
          "end_sec": 10500,
          "start_time": "02:50:00",
          "end_time": "02:55:00",
          "count": 4
        },
        {
          "start_sec": 10500,
          "end_sec": 10800,
          "start_time": "02:55:00",
          "end_time": "03:00:00",
          "count": 2
        },
        {
          "start_sec": 10800,
          "end_sec": 11100,
          "start_time": "03:00:00",
          "end_time": "03:05:00",
          "count": 3
        },
        {
          "start_sec": 11100,
          "end_sec": 11400,
          "start_time": "03:05:00",
          "end_time": "03:10:00",
          "count": 5
        },
        {
          "start_sec": 11400,
          "end_sec": 11700,
          "start_time": "03:10:00",
          "end_time": "03:15:00",
          "count": 3
        },
        {
          "start_sec": 11700,
          "end_sec": 12000,
          "start_time": "03:15:00",
          "end_time": "03:20:00",
          "count": 2
        },
        {
          "start_sec": 12000,
          "end_sec": 12300,
          "start_time": "03:20:00",
          "end_time": "03:25:00",
          "count": 1
        },
        {
          "start_sec": 12300,
          "end_sec": 12600,
          "start_time": "03:25:00",
          "end_time": "03:30:00",
          "count": 2
        },
        {
          "start_sec": 12600,
          "end_sec": 12900,
          "start_time": "03:30:00",
          "end_time": "03:35:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        4482,
        4881,
        4992,
        5022,
        5572,
        5680,
        5689,
        5834,
        5840,
        5970,
        6102,
        6118,
        6169,
        6170,
        6211,
        6320,
        6363,
        6382,
        6458,
        6465,
        6530,
        6543,
        6633,
        6642,
        6663,
        6667,
        6733,
        6804,
        6814,
        6880,
        6925,
        6959,
        7042,
        7076,
        7151,
        7156,
        7160,
        7204,
        7205,
        7231,
        7418,
        7453,
        7529,
        7572,
        7589,
        7629,
        7641,
        7681,
        7740,
        7752,
        7772,
        7773,
        7792,
        7814,
        7819,
        7823,
        7876,
        7877,
        7947,
        7951,
        8028,
        8056,
        8059,
        8128,
        8147,
        8166,
        8201,
        8228,
        8257,
        8266,
        8312,
        8315,
        8339,
        8466,
        8569,
        8684,
        8693,
        8697,
        8729,
        8844,
        8915,
        8993,
        9055,
        9082,
        9135,
        9202,
        9358,
        9549,
        9583,
        9594,
        9628,
        9670,
        9691,
        9725,
        9737,
        9759,
        9760,
        9883,
        9975,
        10154,
        10173,
        10189,
        10208,
        10324,
        10460,
        10473,
        10510,
        10648,
        10915,
        10930,
        11085,
        11133,
        11190,
        11217,
        11321,
        11387,
        11442,
        11460,
        11485,
        11948,
        11955,
        12148,
        12361,
        12416
      ]
    },
    "2025_chiayi_twinlake_elite__全馬組__男A組": {
      "histogram_5min": [
        {
          "start_sec": 21000,
          "end_sec": 21300,
          "start_time": "05:50:00",
          "end_time": "05:55:00",
          "count": 1
        },
        {
          "start_sec": 21300,
          "end_sec": 21600,
          "start_time": "05:55:00",
          "end_time": "06:00:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        21170
      ]
    },
    "2025_chiayi_twinlake_elite__半馬組__女F組": {
      "histogram_5min": [
        {
          "start_sec": 7800,
          "end_sec": 8100,
          "start_time": "02:10:00",
          "end_time": "02:15:00",
          "count": 1
        },
        {
          "start_sec": 8100,
          "end_sec": 8400,
          "start_time": "02:15:00",
          "end_time": "02:20:00",
          "count": 0
        },
        {
          "start_sec": 8400,
          "end_sec": 8700,
          "start_time": "02:20:00",
          "end_time": "02:25:00",
          "count": 0
        },
        {
          "start_sec": 8700,
          "end_sec": 9000,
          "start_time": "02:25:00",
          "end_time": "02:30:00",
          "count": 0
        },
        {
          "start_sec": 9000,
          "end_sec": 9300,
          "start_time": "02:30:00",
          "end_time": "02:35:00",
          "count": 1
        },
        {
          "start_sec": 9300,
          "end_sec": 9600,
          "start_time": "02:35:00",
          "end_time": "02:40:00",
          "count": 0
        },
        {
          "start_sec": 9600,
          "end_sec": 9900,
          "start_time": "02:40:00",
          "end_time": "02:45:00",
          "count": 1
        },
        {
          "start_sec": 9900,
          "end_sec": 10200,
          "start_time": "02:45:00",
          "end_time": "02:50:00",
          "count": 0
        },
        {
          "start_sec": 10200,
          "end_sec": 10500,
          "start_time": "02:50:00",
          "end_time": "02:55:00",
          "count": 0
        },
        {
          "start_sec": 10500,
          "end_sec": 10800,
          "start_time": "02:55:00",
          "end_time": "03:00:00",
          "count": 0
        },
        {
          "start_sec": 10800,
          "end_sec": 11100,
          "start_time": "03:00:00",
          "end_time": "03:05:00",
          "count": 0
        },
        {
          "start_sec": 11100,
          "end_sec": 11400,
          "start_time": "03:05:00",
          "end_time": "03:10:00",
          "count": 1
        },
        {
          "start_sec": 11400,
          "end_sec": 11700,
          "start_time": "03:10:00",
          "end_time": "03:15:00",
          "count": 1
        },
        {
          "start_sec": 11700,
          "end_sec": 12000,
          "start_time": "03:15:00",
          "end_time": "03:20:00",
          "count": 1
        },
        {
          "start_sec": 12000,
          "end_sec": 12300,
          "start_time": "03:20:00",
          "end_time": "03:25:00",
          "count": 0
        },
        {
          "start_sec": 12300,
          "end_sec": 12600,
          "start_time": "03:25:00",
          "end_time": "03:30:00",
          "count": 1
        },
        {
          "start_sec": 12600,
          "end_sec": 12900,
          "start_time": "03:30:00",
          "end_time": "03:35:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        7998,
        9239,
        9897,
        11380,
        11636,
        11751,
        12558
      ]
    },
    "2025_chiayi_twinlake_elite__半馬組__男E組": {
      "histogram_5min": [
        {
          "start_sec": 5400,
          "end_sec": 5700,
          "start_time": "01:30:00",
          "end_time": "01:35:00",
          "count": 1
        },
        {
          "start_sec": 5700,
          "end_sec": 6000,
          "start_time": "01:35:00",
          "end_time": "01:40:00",
          "count": 2
        },
        {
          "start_sec": 6000,
          "end_sec": 6300,
          "start_time": "01:40:00",
          "end_time": "01:45:00",
          "count": 4
        },
        {
          "start_sec": 6300,
          "end_sec": 6600,
          "start_time": "01:45:00",
          "end_time": "01:50:00",
          "count": 4
        },
        {
          "start_sec": 6600,
          "end_sec": 6900,
          "start_time": "01:50:00",
          "end_time": "01:55:00",
          "count": 7
        },
        {
          "start_sec": 6900,
          "end_sec": 7200,
          "start_time": "01:55:00",
          "end_time": "02:00:00",
          "count": 4
        },
        {
          "start_sec": 7200,
          "end_sec": 7500,
          "start_time": "02:00:00",
          "end_time": "02:05:00",
          "count": 6
        },
        {
          "start_sec": 7500,
          "end_sec": 7800,
          "start_time": "02:05:00",
          "end_time": "02:10:00",
          "count": 5
        },
        {
          "start_sec": 7800,
          "end_sec": 8100,
          "start_time": "02:10:00",
          "end_time": "02:15:00",
          "count": 9
        },
        {
          "start_sec": 8100,
          "end_sec": 8400,
          "start_time": "02:15:00",
          "end_time": "02:20:00",
          "count": 5
        },
        {
          "start_sec": 8400,
          "end_sec": 8700,
          "start_time": "02:20:00",
          "end_time": "02:25:00",
          "count": 4
        },
        {
          "start_sec": 8700,
          "end_sec": 9000,
          "start_time": "02:25:00",
          "end_time": "02:30:00",
          "count": 7
        },
        {
          "start_sec": 9000,
          "end_sec": 9300,
          "start_time": "02:30:00",
          "end_time": "02:35:00",
          "count": 8
        },
        {
          "start_sec": 9300,
          "end_sec": 9600,
          "start_time": "02:35:00",
          "end_time": "02:40:00",
          "count": 3
        },
        {
          "start_sec": 9600,
          "end_sec": 9900,
          "start_time": "02:40:00",
          "end_time": "02:45:00",
          "count": 3
        },
        {
          "start_sec": 9900,
          "end_sec": 10200,
          "start_time": "02:45:00",
          "end_time": "02:50:00",
          "count": 3
        },
        {
          "start_sec": 10200,
          "end_sec": 10500,
          "start_time": "02:50:00",
          "end_time": "02:55:00",
          "count": 6
        },
        {
          "start_sec": 10500,
          "end_sec": 10800,
          "start_time": "02:55:00",
          "end_time": "03:00:00",
          "count": 2
        },
        {
          "start_sec": 10800,
          "end_sec": 11100,
          "start_time": "03:00:00",
          "end_time": "03:05:00",
          "count": 4
        },
        {
          "start_sec": 11100,
          "end_sec": 11400,
          "start_time": "03:05:00",
          "end_time": "03:10:00",
          "count": 4
        },
        {
          "start_sec": 11400,
          "end_sec": 11700,
          "start_time": "03:10:00",
          "end_time": "03:15:00",
          "count": 1
        },
        {
          "start_sec": 11700,
          "end_sec": 12000,
          "start_time": "03:15:00",
          "end_time": "03:20:00",
          "count": 0
        },
        {
          "start_sec": 12000,
          "end_sec": 12300,
          "start_time": "03:20:00",
          "end_time": "03:25:00",
          "count": 3
        },
        {
          "start_sec": 12300,
          "end_sec": 12600,
          "start_time": "03:25:00",
          "end_time": "03:30:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        5526,
        5819,
        5985,
        6028,
        6178,
        6204,
        6225,
        6362,
        6430,
        6492,
        6496,
        6604,
        6742,
        6767,
        6810,
        6813,
        6828,
        6894,
        6972,
        7011,
        7054,
        7065,
        7260,
        7344,
        7398,
        7423,
        7447,
        7476,
        7538,
        7691,
        7709,
        7737,
        7761,
        7854,
        7906,
        7962,
        7963,
        7997,
        8001,
        8003,
        8022,
        8035,
        8208,
        8209,
        8259,
        8280,
        8323,
        8516,
        8540,
        8615,
        8643,
        8753,
        8774,
        8802,
        8865,
        8891,
        8903,
        8906,
        9000,
        9055,
        9057,
        9066,
        9123,
        9199,
        9230,
        9241,
        9498,
        9520,
        9569,
        9657,
        9776,
        9883,
        9972,
        10041,
        10077,
        10211,
        10231,
        10252,
        10354,
        10355,
        10430,
        10677,
        10679,
        10860,
        10862,
        10933,
        11064,
        11212,
        11218,
        11250,
        11282,
        11489,
        12115,
        12115,
        12203
      ]
    },
    "2025_chiayi_twinlake_elite__半馬組__女B組": {
      "histogram_5min": [
        {
          "start_sec": 5100,
          "end_sec": 5400,
          "start_time": "01:25:00",
          "end_time": "01:30:00",
          "count": 2
        },
        {
          "start_sec": 5400,
          "end_sec": 5700,
          "start_time": "01:30:00",
          "end_time": "01:35:00",
          "count": 1
        },
        {
          "start_sec": 5700,
          "end_sec": 6000,
          "start_time": "01:35:00",
          "end_time": "01:40:00",
          "count": 0
        },
        {
          "start_sec": 6000,
          "end_sec": 6300,
          "start_time": "01:40:00",
          "end_time": "01:45:00",
          "count": 0
        },
        {
          "start_sec": 6300,
          "end_sec": 6600,
          "start_time": "01:45:00",
          "end_time": "01:50:00",
          "count": 0
        },
        {
          "start_sec": 6600,
          "end_sec": 6900,
          "start_time": "01:50:00",
          "end_time": "01:55:00",
          "count": 0
        },
        {
          "start_sec": 6900,
          "end_sec": 7200,
          "start_time": "01:55:00",
          "end_time": "02:00:00",
          "count": 1
        },
        {
          "start_sec": 7200,
          "end_sec": 7500,
          "start_time": "02:00:00",
          "end_time": "02:05:00",
          "count": 1
        },
        {
          "start_sec": 7500,
          "end_sec": 7800,
          "start_time": "02:05:00",
          "end_time": "02:10:00",
          "count": 1
        },
        {
          "start_sec": 7800,
          "end_sec": 8100,
          "start_time": "02:10:00",
          "end_time": "02:15:00",
          "count": 2
        },
        {
          "start_sec": 8100,
          "end_sec": 8400,
          "start_time": "02:15:00",
          "end_time": "02:20:00",
          "count": 0
        },
        {
          "start_sec": 8400,
          "end_sec": 8700,
          "start_time": "02:20:00",
          "end_time": "02:25:00",
          "count": 1
        },
        {
          "start_sec": 8700,
          "end_sec": 9000,
          "start_time": "02:25:00",
          "end_time": "02:30:00",
          "count": 1
        },
        {
          "start_sec": 9000,
          "end_sec": 9300,
          "start_time": "02:30:00",
          "end_time": "02:35:00",
          "count": 2
        },
        {
          "start_sec": 9300,
          "end_sec": 9600,
          "start_time": "02:35:00",
          "end_time": "02:40:00",
          "count": 1
        },
        {
          "start_sec": 9600,
          "end_sec": 9900,
          "start_time": "02:40:00",
          "end_time": "02:45:00",
          "count": 1
        },
        {
          "start_sec": 9900,
          "end_sec": 10200,
          "start_time": "02:45:00",
          "end_time": "02:50:00",
          "count": 1
        },
        {
          "start_sec": 10200,
          "end_sec": 10500,
          "start_time": "02:50:00",
          "end_time": "02:55:00",
          "count": 1
        },
        {
          "start_sec": 10500,
          "end_sec": 10800,
          "start_time": "02:55:00",
          "end_time": "03:00:00",
          "count": 2
        },
        {
          "start_sec": 10800,
          "end_sec": 11100,
          "start_time": "03:00:00",
          "end_time": "03:05:00",
          "count": 0
        },
        {
          "start_sec": 11100,
          "end_sec": 11400,
          "start_time": "03:05:00",
          "end_time": "03:10:00",
          "count": 1
        },
        {
          "start_sec": 11400,
          "end_sec": 11700,
          "start_time": "03:10:00",
          "end_time": "03:15:00",
          "count": 1
        },
        {
          "start_sec": 11700,
          "end_sec": 12000,
          "start_time": "03:15:00",
          "end_time": "03:20:00",
          "count": 2
        },
        {
          "start_sec": 12000,
          "end_sec": 12300,
          "start_time": "03:20:00",
          "end_time": "03:25:00",
          "count": 1
        },
        {
          "start_sec": 12300,
          "end_sec": 12600,
          "start_time": "03:25:00",
          "end_time": "03:30:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        5207,
        5365,
        5506,
        7026,
        7207,
        7705,
        7931,
        7953,
        8595,
        8731,
        9218,
        9221,
        9493,
        9626,
        9973,
        10415,
        10524,
        10633,
        11322,
        11533,
        11764,
        11776,
        12193
      ]
    },
    "2025_chiayi_twinlake_elite__全馬組__女D組": {
      "histogram_5min": [
        {
          "start_sec": 9900,
          "end_sec": 10200,
          "start_time": "02:45:00",
          "end_time": "02:50:00",
          "count": 1
        },
        {
          "start_sec": 10200,
          "end_sec": 10500,
          "start_time": "02:50:00",
          "end_time": "02:55:00",
          "count": 0
        },
        {
          "start_sec": 10500,
          "end_sec": 10800,
          "start_time": "02:55:00",
          "end_time": "03:00:00",
          "count": 1
        },
        {
          "start_sec": 10800,
          "end_sec": 11100,
          "start_time": "03:00:00",
          "end_time": "03:05:00",
          "count": 0
        },
        {
          "start_sec": 11100,
          "end_sec": 11400,
          "start_time": "03:05:00",
          "end_time": "03:10:00",
          "count": 1
        },
        {
          "start_sec": 11400,
          "end_sec": 11700,
          "start_time": "03:10:00",
          "end_time": "03:15:00",
          "count": 1
        },
        {
          "start_sec": 11700,
          "end_sec": 12000,
          "start_time": "03:15:00",
          "end_time": "03:20:00",
          "count": 1
        },
        {
          "start_sec": 12000,
          "end_sec": 12300,
          "start_time": "03:20:00",
          "end_time": "03:25:00",
          "count": 1
        },
        {
          "start_sec": 12300,
          "end_sec": 12600,
          "start_time": "03:25:00",
          "end_time": "03:30:00",
          "count": 0
        },
        {
          "start_sec": 12600,
          "end_sec": 12900,
          "start_time": "03:30:00",
          "end_time": "03:35:00",
          "count": 0
        },
        {
          "start_sec": 12900,
          "end_sec": 13200,
          "start_time": "03:35:00",
          "end_time": "03:40:00",
          "count": 1
        },
        {
          "start_sec": 13200,
          "end_sec": 13500,
          "start_time": "03:40:00",
          "end_time": "03:45:00",
          "count": 1
        },
        {
          "start_sec": 13500,
          "end_sec": 13800,
          "start_time": "03:45:00",
          "end_time": "03:50:00",
          "count": 0
        },
        {
          "start_sec": 13800,
          "end_sec": 14100,
          "start_time": "03:50:00",
          "end_time": "03:55:00",
          "count": 0
        },
        {
          "start_sec": 14100,
          "end_sec": 14400,
          "start_time": "03:55:00",
          "end_time": "04:00:00",
          "count": 0
        },
        {
          "start_sec": 14400,
          "end_sec": 14700,
          "start_time": "04:00:00",
          "end_time": "04:05:00",
          "count": 1
        },
        {
          "start_sec": 14700,
          "end_sec": 15000,
          "start_time": "04:05:00",
          "end_time": "04:10:00",
          "count": 0
        },
        {
          "start_sec": 15000,
          "end_sec": 15300,
          "start_time": "04:10:00",
          "end_time": "04:15:00",
          "count": 0
        },
        {
          "start_sec": 15300,
          "end_sec": 15600,
          "start_time": "04:15:00",
          "end_time": "04:20:00",
          "count": 1
        },
        {
          "start_sec": 15600,
          "end_sec": 15900,
          "start_time": "04:20:00",
          "end_time": "04:25:00",
          "count": 0
        },
        {
          "start_sec": 15900,
          "end_sec": 16200,
          "start_time": "04:25:00",
          "end_time": "04:30:00",
          "count": 0
        },
        {
          "start_sec": 16200,
          "end_sec": 16500,
          "start_time": "04:30:00",
          "end_time": "04:35:00",
          "count": 0
        },
        {
          "start_sec": 16500,
          "end_sec": 16800,
          "start_time": "04:35:00",
          "end_time": "04:40:00",
          "count": 0
        },
        {
          "start_sec": 16800,
          "end_sec": 17100,
          "start_time": "04:40:00",
          "end_time": "04:45:00",
          "count": 0
        },
        {
          "start_sec": 17100,
          "end_sec": 17400,
          "start_time": "04:45:00",
          "end_time": "04:50:00",
          "count": 0
        },
        {
          "start_sec": 17400,
          "end_sec": 17700,
          "start_time": "04:50:00",
          "end_time": "04:55:00",
          "count": 0
        },
        {
          "start_sec": 17700,
          "end_sec": 18000,
          "start_time": "04:55:00",
          "end_time": "05:00:00",
          "count": 0
        },
        {
          "start_sec": 18000,
          "end_sec": 18300,
          "start_time": "05:00:00",
          "end_time": "05:05:00",
          "count": 0
        },
        {
          "start_sec": 18300,
          "end_sec": 18600,
          "start_time": "05:05:00",
          "end_time": "05:10:00",
          "count": 0
        },
        {
          "start_sec": 18600,
          "end_sec": 18900,
          "start_time": "05:10:00",
          "end_time": "05:15:00",
          "count": 0
        },
        {
          "start_sec": 18900,
          "end_sec": 19200,
          "start_time": "05:15:00",
          "end_time": "05:20:00",
          "count": 0
        },
        {
          "start_sec": 19200,
          "end_sec": 19500,
          "start_time": "05:20:00",
          "end_time": "05:25:00",
          "count": 1
        },
        {
          "start_sec": 19500,
          "end_sec": 19800,
          "start_time": "05:25:00",
          "end_time": "05:30:00",
          "count": 2
        },
        {
          "start_sec": 19800,
          "end_sec": 20100,
          "start_time": "05:30:00",
          "end_time": "05:35:00",
          "count": 1
        },
        {
          "start_sec": 20100,
          "end_sec": 20400,
          "start_time": "05:35:00",
          "end_time": "05:40:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        10044,
        10665,
        11379,
        11649,
        11775,
        12221,
        13014,
        13328,
        14556,
        15395,
        19360,
        19594,
        19679,
        20056
      ]
    },
    "2025_chiayi_twinlake_elite__全馬組__男F組": {
      "histogram_5min": [
        {
          "start_sec": 13500,
          "end_sec": 13800,
          "start_time": "03:45:00",
          "end_time": "03:50:00",
          "count": 1
        },
        {
          "start_sec": 13800,
          "end_sec": 14100,
          "start_time": "03:50:00",
          "end_time": "03:55:00",
          "count": 0
        },
        {
          "start_sec": 14100,
          "end_sec": 14400,
          "start_time": "03:55:00",
          "end_time": "04:00:00",
          "count": 1
        },
        {
          "start_sec": 14400,
          "end_sec": 14700,
          "start_time": "04:00:00",
          "end_time": "04:05:00",
          "count": 0
        },
        {
          "start_sec": 14700,
          "end_sec": 15000,
          "start_time": "04:05:00",
          "end_time": "04:10:00",
          "count": 0
        },
        {
          "start_sec": 15000,
          "end_sec": 15300,
          "start_time": "04:10:00",
          "end_time": "04:15:00",
          "count": 1
        },
        {
          "start_sec": 15300,
          "end_sec": 15600,
          "start_time": "04:15:00",
          "end_time": "04:20:00",
          "count": 1
        },
        {
          "start_sec": 15600,
          "end_sec": 15900,
          "start_time": "04:20:00",
          "end_time": "04:25:00",
          "count": 2
        },
        {
          "start_sec": 15900,
          "end_sec": 16200,
          "start_time": "04:25:00",
          "end_time": "04:30:00",
          "count": 0
        },
        {
          "start_sec": 16200,
          "end_sec": 16500,
          "start_time": "04:30:00",
          "end_time": "04:35:00",
          "count": 1
        },
        {
          "start_sec": 16500,
          "end_sec": 16800,
          "start_time": "04:35:00",
          "end_time": "04:40:00",
          "count": 1
        },
        {
          "start_sec": 16800,
          "end_sec": 17100,
          "start_time": "04:40:00",
          "end_time": "04:45:00",
          "count": 0
        },
        {
          "start_sec": 17100,
          "end_sec": 17400,
          "start_time": "04:45:00",
          "end_time": "04:50:00",
          "count": 4
        },
        {
          "start_sec": 17400,
          "end_sec": 17700,
          "start_time": "04:50:00",
          "end_time": "04:55:00",
          "count": 1
        },
        {
          "start_sec": 17700,
          "end_sec": 18000,
          "start_time": "04:55:00",
          "end_time": "05:00:00",
          "count": 0
        },
        {
          "start_sec": 18000,
          "end_sec": 18300,
          "start_time": "05:00:00",
          "end_time": "05:05:00",
          "count": 3
        },
        {
          "start_sec": 18300,
          "end_sec": 18600,
          "start_time": "05:05:00",
          "end_time": "05:10:00",
          "count": 1
        },
        {
          "start_sec": 18600,
          "end_sec": 18900,
          "start_time": "05:10:00",
          "end_time": "05:15:00",
          "count": 0
        },
        {
          "start_sec": 18900,
          "end_sec": 19200,
          "start_time": "05:15:00",
          "end_time": "05:20:00",
          "count": 0
        },
        {
          "start_sec": 19200,
          "end_sec": 19500,
          "start_time": "05:20:00",
          "end_time": "05:25:00",
          "count": 1
        },
        {
          "start_sec": 19500,
          "end_sec": 19800,
          "start_time": "05:25:00",
          "end_time": "05:30:00",
          "count": 0
        },
        {
          "start_sec": 19800,
          "end_sec": 20100,
          "start_time": "05:30:00",
          "end_time": "05:35:00",
          "count": 1
        },
        {
          "start_sec": 20100,
          "end_sec": 20400,
          "start_time": "05:35:00",
          "end_time": "05:40:00",
          "count": 0
        },
        {
          "start_sec": 20400,
          "end_sec": 20700,
          "start_time": "05:40:00",
          "end_time": "05:45:00",
          "count": 0
        },
        {
          "start_sec": 20700,
          "end_sec": 21000,
          "start_time": "05:45:00",
          "end_time": "05:50:00",
          "count": 0
        },
        {
          "start_sec": 21000,
          "end_sec": 21300,
          "start_time": "05:50:00",
          "end_time": "05:55:00",
          "count": 1
        },
        {
          "start_sec": 21300,
          "end_sec": 21600,
          "start_time": "05:55:00",
          "end_time": "06:00:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        13599,
        14150,
        15026,
        15429,
        15621,
        15744,
        16455,
        16724,
        17109,
        17210,
        17240,
        17341,
        17438,
        18107,
        18171,
        18215,
        18500,
        19202,
        19940,
        21294
      ]
    },
    "2025_chiayi_twinlake_elite__半馬組__男A組": {
      "histogram_5min": [
        {
          "start_sec": 5400,
          "end_sec": 5700,
          "start_time": "01:30:00",
          "end_time": "01:35:00",
          "count": 1
        },
        {
          "start_sec": 5700,
          "end_sec": 6000,
          "start_time": "01:35:00",
          "end_time": "01:40:00",
          "count": 0
        },
        {
          "start_sec": 6000,
          "end_sec": 6300,
          "start_time": "01:40:00",
          "end_time": "01:45:00",
          "count": 0
        },
        {
          "start_sec": 6300,
          "end_sec": 6600,
          "start_time": "01:45:00",
          "end_time": "01:50:00",
          "count": 0
        },
        {
          "start_sec": 6600,
          "end_sec": 6900,
          "start_time": "01:50:00",
          "end_time": "01:55:00",
          "count": 0
        },
        {
          "start_sec": 6900,
          "end_sec": 7200,
          "start_time": "01:55:00",
          "end_time": "02:00:00",
          "count": 1
        },
        {
          "start_sec": 7200,
          "end_sec": 7500,
          "start_time": "02:00:00",
          "end_time": "02:05:00",
          "count": 0
        },
        {
          "start_sec": 7500,
          "end_sec": 7800,
          "start_time": "02:05:00",
          "end_time": "02:10:00",
          "count": 0
        },
        {
          "start_sec": 7800,
          "end_sec": 8100,
          "start_time": "02:10:00",
          "end_time": "02:15:00",
          "count": 0
        },
        {
          "start_sec": 8100,
          "end_sec": 8400,
          "start_time": "02:15:00",
          "end_time": "02:20:00",
          "count": 0
        },
        {
          "start_sec": 8400,
          "end_sec": 8700,
          "start_time": "02:20:00",
          "end_time": "02:25:00",
          "count": 1
        },
        {
          "start_sec": 8700,
          "end_sec": 9000,
          "start_time": "02:25:00",
          "end_time": "02:30:00",
          "count": 0
        },
        {
          "start_sec": 9000,
          "end_sec": 9300,
          "start_time": "02:30:00",
          "end_time": "02:35:00",
          "count": 0
        },
        {
          "start_sec": 9300,
          "end_sec": 9600,
          "start_time": "02:35:00",
          "end_time": "02:40:00",
          "count": 0
        },
        {
          "start_sec": 9600,
          "end_sec": 9900,
          "start_time": "02:40:00",
          "end_time": "02:45:00",
          "count": 2
        },
        {
          "start_sec": 9900,
          "end_sec": 10200,
          "start_time": "02:45:00",
          "end_time": "02:50:00",
          "count": 0
        },
        {
          "start_sec": 10200,
          "end_sec": 10500,
          "start_time": "02:50:00",
          "end_time": "02:55:00",
          "count": 0
        },
        {
          "start_sec": 10500,
          "end_sec": 10800,
          "start_time": "02:55:00",
          "end_time": "03:00:00",
          "count": 0
        },
        {
          "start_sec": 10800,
          "end_sec": 11100,
          "start_time": "03:00:00",
          "end_time": "03:05:00",
          "count": 0
        },
        {
          "start_sec": 11100,
          "end_sec": 11400,
          "start_time": "03:05:00",
          "end_time": "03:10:00",
          "count": 0
        },
        {
          "start_sec": 11400,
          "end_sec": 11700,
          "start_time": "03:10:00",
          "end_time": "03:15:00",
          "count": 1
        },
        {
          "start_sec": 11700,
          "end_sec": 12000,
          "start_time": "03:15:00",
          "end_time": "03:20:00",
          "count": 0
        },
        {
          "start_sec": 12000,
          "end_sec": 12300,
          "start_time": "03:20:00",
          "end_time": "03:25:00",
          "count": 3
        },
        {
          "start_sec": 12300,
          "end_sec": 12600,
          "start_time": "03:25:00",
          "end_time": "03:30:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        5628,
        7197,
        8442,
        9696,
        9715,
        11627,
        12209,
        12231,
        12233
      ]
    },
    "2025_chiayi_twinlake_elite__半馬組__女C組": {
      "histogram_5min": [
        {
          "start_sec": 4800,
          "end_sec": 5100,
          "start_time": "01:20:00",
          "end_time": "01:25:00",
          "count": 3
        },
        {
          "start_sec": 5100,
          "end_sec": 5400,
          "start_time": "01:25:00",
          "end_time": "01:30:00",
          "count": 1
        },
        {
          "start_sec": 5400,
          "end_sec": 5700,
          "start_time": "01:30:00",
          "end_time": "01:35:00",
          "count": 0
        },
        {
          "start_sec": 5700,
          "end_sec": 6000,
          "start_time": "01:35:00",
          "end_time": "01:40:00",
          "count": 0
        },
        {
          "start_sec": 6000,
          "end_sec": 6300,
          "start_time": "01:40:00",
          "end_time": "01:45:00",
          "count": 0
        },
        {
          "start_sec": 6300,
          "end_sec": 6600,
          "start_time": "01:45:00",
          "end_time": "01:50:00",
          "count": 0
        },
        {
          "start_sec": 6600,
          "end_sec": 6900,
          "start_time": "01:50:00",
          "end_time": "01:55:00",
          "count": 0
        },
        {
          "start_sec": 6900,
          "end_sec": 7200,
          "start_time": "01:55:00",
          "end_time": "02:00:00",
          "count": 0
        },
        {
          "start_sec": 7200,
          "end_sec": 7500,
          "start_time": "02:00:00",
          "end_time": "02:05:00",
          "count": 0
        },
        {
          "start_sec": 7500,
          "end_sec": 7800,
          "start_time": "02:05:00",
          "end_time": "02:10:00",
          "count": 0
        },
        {
          "start_sec": 7800,
          "end_sec": 8100,
          "start_time": "02:10:00",
          "end_time": "02:15:00",
          "count": 1
        },
        {
          "start_sec": 8100,
          "end_sec": 8400,
          "start_time": "02:15:00",
          "end_time": "02:20:00",
          "count": 4
        },
        {
          "start_sec": 8400,
          "end_sec": 8700,
          "start_time": "02:20:00",
          "end_time": "02:25:00",
          "count": 5
        },
        {
          "start_sec": 8700,
          "end_sec": 9000,
          "start_time": "02:25:00",
          "end_time": "02:30:00",
          "count": 3
        },
        {
          "start_sec": 9000,
          "end_sec": 9300,
          "start_time": "02:30:00",
          "end_time": "02:35:00",
          "count": 3
        },
        {
          "start_sec": 9300,
          "end_sec": 9600,
          "start_time": "02:35:00",
          "end_time": "02:40:00",
          "count": 3
        },
        {
          "start_sec": 9600,
          "end_sec": 9900,
          "start_time": "02:40:00",
          "end_time": "02:45:00",
          "count": 4
        },
        {
          "start_sec": 9900,
          "end_sec": 10200,
          "start_time": "02:45:00",
          "end_time": "02:50:00",
          "count": 2
        },
        {
          "start_sec": 10200,
          "end_sec": 10500,
          "start_time": "02:50:00",
          "end_time": "02:55:00",
          "count": 4
        },
        {
          "start_sec": 10500,
          "end_sec": 10800,
          "start_time": "02:55:00",
          "end_time": "03:00:00",
          "count": 5
        },
        {
          "start_sec": 10800,
          "end_sec": 11100,
          "start_time": "03:00:00",
          "end_time": "03:05:00",
          "count": 3
        },
        {
          "start_sec": 11100,
          "end_sec": 11400,
          "start_time": "03:05:00",
          "end_time": "03:10:00",
          "count": 1
        },
        {
          "start_sec": 11400,
          "end_sec": 11700,
          "start_time": "03:10:00",
          "end_time": "03:15:00",
          "count": 2
        },
        {
          "start_sec": 11700,
          "end_sec": 12000,
          "start_time": "03:15:00",
          "end_time": "03:20:00",
          "count": 2
        },
        {
          "start_sec": 12000,
          "end_sec": 12300,
          "start_time": "03:20:00",
          "end_time": "03:25:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        4997,
        5048,
        5098,
        5365,
        7828,
        8176,
        8217,
        8237,
        8362,
        8563,
        8569,
        8575,
        8599,
        8632,
        8718,
        8843,
        8916,
        9035,
        9098,
        9106,
        9313,
        9417,
        9478,
        9765,
        9813,
        9813,
        9882,
        10121,
        10154,
        10324,
        10334,
        10455,
        10465,
        10623,
        10653,
        10671,
        10679,
        10708,
        10831,
        10851,
        10910,
        11243,
        11420,
        11653,
        11926,
        11948
      ]
    },
    "2025_chiayi_twinlake_elite__半馬組__男B組": {
      "histogram_5min": [
        {
          "start_sec": 3900,
          "end_sec": 4200,
          "start_time": "01:05:00",
          "end_time": "01:10:00",
          "count": 2
        },
        {
          "start_sec": 4200,
          "end_sec": 4500,
          "start_time": "01:10:00",
          "end_time": "01:15:00",
          "count": 1
        },
        {
          "start_sec": 4500,
          "end_sec": 4800,
          "start_time": "01:15:00",
          "end_time": "01:20:00",
          "count": 1
        },
        {
          "start_sec": 4800,
          "end_sec": 5100,
          "start_time": "01:20:00",
          "end_time": "01:25:00",
          "count": 1
        },
        {
          "start_sec": 5100,
          "end_sec": 5400,
          "start_time": "01:25:00",
          "end_time": "01:30:00",
          "count": 2
        },
        {
          "start_sec": 5400,
          "end_sec": 5700,
          "start_time": "01:30:00",
          "end_time": "01:35:00",
          "count": 1
        },
        {
          "start_sec": 5700,
          "end_sec": 6000,
          "start_time": "01:35:00",
          "end_time": "01:40:00",
          "count": 6
        },
        {
          "start_sec": 6000,
          "end_sec": 6300,
          "start_time": "01:40:00",
          "end_time": "01:45:00",
          "count": 5
        },
        {
          "start_sec": 6300,
          "end_sec": 6600,
          "start_time": "01:45:00",
          "end_time": "01:50:00",
          "count": 1
        },
        {
          "start_sec": 6600,
          "end_sec": 6900,
          "start_time": "01:50:00",
          "end_time": "01:55:00",
          "count": 7
        },
        {
          "start_sec": 6900,
          "end_sec": 7200,
          "start_time": "01:55:00",
          "end_time": "02:00:00",
          "count": 8
        },
        {
          "start_sec": 7200,
          "end_sec": 7500,
          "start_time": "02:00:00",
          "end_time": "02:05:00",
          "count": 7
        },
        {
          "start_sec": 7500,
          "end_sec": 7800,
          "start_time": "02:05:00",
          "end_time": "02:10:00",
          "count": 9
        },
        {
          "start_sec": 7800,
          "end_sec": 8100,
          "start_time": "02:10:00",
          "end_time": "02:15:00",
          "count": 5
        },
        {
          "start_sec": 8100,
          "end_sec": 8400,
          "start_time": "02:15:00",
          "end_time": "02:20:00",
          "count": 5
        },
        {
          "start_sec": 8400,
          "end_sec": 8700,
          "start_time": "02:20:00",
          "end_time": "02:25:00",
          "count": 8
        },
        {
          "start_sec": 8700,
          "end_sec": 9000,
          "start_time": "02:25:00",
          "end_time": "02:30:00",
          "count": 6
        },
        {
          "start_sec": 9000,
          "end_sec": 9300,
          "start_time": "02:30:00",
          "end_time": "02:35:00",
          "count": 8
        },
        {
          "start_sec": 9300,
          "end_sec": 9600,
          "start_time": "02:35:00",
          "end_time": "02:40:00",
          "count": 4
        },
        {
          "start_sec": 9600,
          "end_sec": 9900,
          "start_time": "02:40:00",
          "end_time": "02:45:00",
          "count": 5
        },
        {
          "start_sec": 9900,
          "end_sec": 10200,
          "start_time": "02:45:00",
          "end_time": "02:50:00",
          "count": 5
        },
        {
          "start_sec": 10200,
          "end_sec": 10500,
          "start_time": "02:50:00",
          "end_time": "02:55:00",
          "count": 2
        },
        {
          "start_sec": 10500,
          "end_sec": 10800,
          "start_time": "02:55:00",
          "end_time": "03:00:00",
          "count": 5
        },
        {
          "start_sec": 10800,
          "end_sec": 11100,
          "start_time": "03:00:00",
          "end_time": "03:05:00",
          "count": 0
        },
        {
          "start_sec": 11100,
          "end_sec": 11400,
          "start_time": "03:05:00",
          "end_time": "03:10:00",
          "count": 1
        },
        {
          "start_sec": 11400,
          "end_sec": 11700,
          "start_time": "03:10:00",
          "end_time": "03:15:00",
          "count": 3
        },
        {
          "start_sec": 11700,
          "end_sec": 12000,
          "start_time": "03:15:00",
          "end_time": "03:20:00",
          "count": 1
        },
        {
          "start_sec": 12000,
          "end_sec": 12300,
          "start_time": "03:20:00",
          "end_time": "03:25:00",
          "count": 1
        },
        {
          "start_sec": 12300,
          "end_sec": 12600,
          "start_time": "03:25:00",
          "end_time": "03:30:00",
          "count": 1
        },
        {
          "start_sec": 12600,
          "end_sec": 12900,
          "start_time": "03:30:00",
          "end_time": "03:35:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        4056,
        4064,
        4278,
        4671,
        5049,
        5359,
        5398,
        5540,
        5706,
        5707,
        5730,
        5807,
        5913,
        5987,
        6035,
        6036,
        6162,
        6203,
        6237,
        6494,
        6639,
        6647,
        6715,
        6761,
        6769,
        6790,
        6844,
        6900,
        6943,
        6949,
        6992,
        7015,
        7034,
        7076,
        7135,
        7283,
        7353,
        7356,
        7399,
        7433,
        7442,
        7477,
        7502,
        7536,
        7548,
        7559,
        7645,
        7649,
        7669,
        7739,
        7777,
        7902,
        7937,
        7973,
        7985,
        8092,
        8112,
        8167,
        8168,
        8221,
        8228,
        8404,
        8464,
        8510,
        8571,
        8579,
        8581,
        8601,
        8613,
        8719,
        8749,
        8798,
        8843,
        8844,
        8995,
        9033,
        9055,
        9084,
        9096,
        9167,
        9194,
        9205,
        9221,
        9393,
        9485,
        9578,
        9578,
        9625,
        9625,
        9777,
        9848,
        9878,
        9997,
        10026,
        10074,
        10121,
        10185,
        10212,
        10251,
        10564,
        10565,
        10623,
        10678,
        10681,
        11143,
        11557,
        11627,
        11652,
        11913,
        12285,
        12409
      ]
    },
    "2025_chiayi_twinlake_elite__全馬組__男C組": {
      "histogram_5min": [
        {
          "start_sec": 8400,
          "end_sec": 8700,
          "start_time": "02:20:00",
          "end_time": "02:25:00",
          "count": 3
        },
        {
          "start_sec": 8700,
          "end_sec": 9000,
          "start_time": "02:25:00",
          "end_time": "02:30:00",
          "count": 0
        },
        {
          "start_sec": 9000,
          "end_sec": 9300,
          "start_time": "02:30:00",
          "end_time": "02:35:00",
          "count": 0
        },
        {
          "start_sec": 9300,
          "end_sec": 9600,
          "start_time": "02:35:00",
          "end_time": "02:40:00",
          "count": 1
        },
        {
          "start_sec": 9600,
          "end_sec": 9900,
          "start_time": "02:40:00",
          "end_time": "02:45:00",
          "count": 3
        },
        {
          "start_sec": 9900,
          "end_sec": 10200,
          "start_time": "02:45:00",
          "end_time": "02:50:00",
          "count": 0
        },
        {
          "start_sec": 10200,
          "end_sec": 10500,
          "start_time": "02:50:00",
          "end_time": "02:55:00",
          "count": 1
        },
        {
          "start_sec": 10500,
          "end_sec": 10800,
          "start_time": "02:55:00",
          "end_time": "03:00:00",
          "count": 0
        },
        {
          "start_sec": 10800,
          "end_sec": 11100,
          "start_time": "03:00:00",
          "end_time": "03:05:00",
          "count": 1
        },
        {
          "start_sec": 11100,
          "end_sec": 11400,
          "start_time": "03:05:00",
          "end_time": "03:10:00",
          "count": 1
        },
        {
          "start_sec": 11400,
          "end_sec": 11700,
          "start_time": "03:10:00",
          "end_time": "03:15:00",
          "count": 0
        },
        {
          "start_sec": 11700,
          "end_sec": 12000,
          "start_time": "03:15:00",
          "end_time": "03:20:00",
          "count": 1
        },
        {
          "start_sec": 12000,
          "end_sec": 12300,
          "start_time": "03:20:00",
          "end_time": "03:25:00",
          "count": 0
        },
        {
          "start_sec": 12300,
          "end_sec": 12600,
          "start_time": "03:25:00",
          "end_time": "03:30:00",
          "count": 1
        },
        {
          "start_sec": 12600,
          "end_sec": 12900,
          "start_time": "03:30:00",
          "end_time": "03:35:00",
          "count": 0
        },
        {
          "start_sec": 12900,
          "end_sec": 13200,
          "start_time": "03:35:00",
          "end_time": "03:40:00",
          "count": 2
        },
        {
          "start_sec": 13200,
          "end_sec": 13500,
          "start_time": "03:40:00",
          "end_time": "03:45:00",
          "count": 0
        },
        {
          "start_sec": 13500,
          "end_sec": 13800,
          "start_time": "03:45:00",
          "end_time": "03:50:00",
          "count": 0
        },
        {
          "start_sec": 13800,
          "end_sec": 14100,
          "start_time": "03:50:00",
          "end_time": "03:55:00",
          "count": 0
        },
        {
          "start_sec": 14100,
          "end_sec": 14400,
          "start_time": "03:55:00",
          "end_time": "04:00:00",
          "count": 0
        },
        {
          "start_sec": 14400,
          "end_sec": 14700,
          "start_time": "04:00:00",
          "end_time": "04:05:00",
          "count": 0
        },
        {
          "start_sec": 14700,
          "end_sec": 15000,
          "start_time": "04:05:00",
          "end_time": "04:10:00",
          "count": 0
        },
        {
          "start_sec": 15000,
          "end_sec": 15300,
          "start_time": "04:10:00",
          "end_time": "04:15:00",
          "count": 0
        },
        {
          "start_sec": 15300,
          "end_sec": 15600,
          "start_time": "04:15:00",
          "end_time": "04:20:00",
          "count": 0
        },
        {
          "start_sec": 15600,
          "end_sec": 15900,
          "start_time": "04:20:00",
          "end_time": "04:25:00",
          "count": 0
        },
        {
          "start_sec": 15900,
          "end_sec": 16200,
          "start_time": "04:25:00",
          "end_time": "04:30:00",
          "count": 1
        },
        {
          "start_sec": 16200,
          "end_sec": 16500,
          "start_time": "04:30:00",
          "end_time": "04:35:00",
          "count": 1
        },
        {
          "start_sec": 16500,
          "end_sec": 16800,
          "start_time": "04:35:00",
          "end_time": "04:40:00",
          "count": 0
        },
        {
          "start_sec": 16800,
          "end_sec": 17100,
          "start_time": "04:40:00",
          "end_time": "04:45:00",
          "count": 0
        },
        {
          "start_sec": 17100,
          "end_sec": 17400,
          "start_time": "04:45:00",
          "end_time": "04:50:00",
          "count": 0
        },
        {
          "start_sec": 17400,
          "end_sec": 17700,
          "start_time": "04:50:00",
          "end_time": "04:55:00",
          "count": 1
        },
        {
          "start_sec": 17700,
          "end_sec": 18000,
          "start_time": "04:55:00",
          "end_time": "05:00:00",
          "count": 0
        },
        {
          "start_sec": 18000,
          "end_sec": 18300,
          "start_time": "05:00:00",
          "end_time": "05:05:00",
          "count": 1
        },
        {
          "start_sec": 18300,
          "end_sec": 18600,
          "start_time": "05:05:00",
          "end_time": "05:10:00",
          "count": 0
        },
        {
          "start_sec": 18600,
          "end_sec": 18900,
          "start_time": "05:10:00",
          "end_time": "05:15:00",
          "count": 0
        },
        {
          "start_sec": 18900,
          "end_sec": 19200,
          "start_time": "05:15:00",
          "end_time": "05:20:00",
          "count": 0
        },
        {
          "start_sec": 19200,
          "end_sec": 19500,
          "start_time": "05:20:00",
          "end_time": "05:25:00",
          "count": 0
        },
        {
          "start_sec": 19500,
          "end_sec": 19800,
          "start_time": "05:25:00",
          "end_time": "05:30:00",
          "count": 1
        },
        {
          "start_sec": 19800,
          "end_sec": 20100,
          "start_time": "05:30:00",
          "end_time": "05:35:00",
          "count": 0
        },
        {
          "start_sec": 20100,
          "end_sec": 20400,
          "start_time": "05:35:00",
          "end_time": "05:40:00",
          "count": 1
        },
        {
          "start_sec": 20400,
          "end_sec": 20700,
          "start_time": "05:40:00",
          "end_time": "05:45:00",
          "count": 1
        },
        {
          "start_sec": 20700,
          "end_sec": 21000,
          "start_time": "05:45:00",
          "end_time": "05:50:00",
          "count": 1
        },
        {
          "start_sec": 21000,
          "end_sec": 21300,
          "start_time": "05:50:00",
          "end_time": "05:55:00",
          "count": 2
        },
        {
          "start_sec": 21300,
          "end_sec": 21600,
          "start_time": "05:55:00",
          "end_time": "06:00:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        8488,
        8510,
        8686,
        9352,
        9658,
        9712,
        9797,
        10413,
        10835,
        11374,
        11713,
        12547,
        12969,
        13001,
        15926,
        16209,
        17608,
        18089,
        19580,
        20339,
        20644,
        20889,
        21030,
        21254
      ]
    },
    "2025_chiayi_twinlake_elite__全馬組__男G組": {
      "histogram_5min": [
        {
          "start_sec": 18000,
          "end_sec": 18300,
          "start_time": "05:00:00",
          "end_time": "05:05:00",
          "count": 1
        },
        {
          "start_sec": 18300,
          "end_sec": 18600,
          "start_time": "05:05:00",
          "end_time": "05:10:00",
          "count": 0
        },
        {
          "start_sec": 18600,
          "end_sec": 18900,
          "start_time": "05:10:00",
          "end_time": "05:15:00",
          "count": 0
        },
        {
          "start_sec": 18900,
          "end_sec": 19200,
          "start_time": "05:15:00",
          "end_time": "05:20:00",
          "count": 0
        },
        {
          "start_sec": 19200,
          "end_sec": 19500,
          "start_time": "05:20:00",
          "end_time": "05:25:00",
          "count": 0
        },
        {
          "start_sec": 19500,
          "end_sec": 19800,
          "start_time": "05:25:00",
          "end_time": "05:30:00",
          "count": 1
        },
        {
          "start_sec": 19800,
          "end_sec": 20100,
          "start_time": "05:30:00",
          "end_time": "05:35:00",
          "count": 0
        }
      ],
      "sorted_seconds": [
        18133,
        19695
      ]
    }
  }
};

// 📊 統計：2賽別 × 26分組 = 855完賽記錄
