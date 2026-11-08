import type { Puzzle } from '../game/types';

export const puzzles: Puzzle[] = [
  {
    "id": "r1-p1",
    "roomId": 1,
    "order": 1,
    "type": "classification",
    "title": "Ba giá sách nguồn gốc",
    "hotspotName": "Kệ bản thảo",
    "learningObjective": "phân biệt các nhóm điều kiện và tiền đề cho sự ra đời CNXH khoa học.",
    "instruction": "Các bản thảo bị xáo trộn. Hãy đặt mỗi bản vào đúng giá sách.",
    "readingNote": "Các điều kiện kinh tế – xã hội phản ánh sự biến đổi của sản xuất và đời sống các giai cấp. Khoa học tự nhiên nghiên cứu quy luật của tự nhiên. Tiền đề tư tưởng – lý luận là những thành tựu học thuyết được tiếp thu có phê phán.",
    "hints": [
      "Có những thẻ nói về xã hội và lao động, những thẻ nói về khoa học tự nhiên, và những thẻ nói về các học thuyết.",
      "Hãy đặt đại công nghiệp vào nhóm điều kiện kinh tế – xã hội; tiếp tục suy luận các thẻ còn lại."
    ],
    "explanation": "Giáo trình trình bày sự ra đời của CNXH khoa học không phải ngẫu nhiên, mà gắn với sự phát triển của đại công nghiệp, phong trào công nhân và những tiền đề khoa học, tư tưởng – lý luận. Các nhóm tiền đề có chức năng khác nhau, nhưng cùng tạo bối cảnh lịch sử cho sự hình thành lý luận. Cần phân biệt bối cảnh lịch sử với những thành tựu nhận thức. Một phong trào xã hội không phải là một phát minh khoa học tự nhiên. Ngược lại, một học thuyết về tự nhiên không trực tiếp mô tả quan hệ giữa các giai cấp. Cách phân loại này giúp nhận ra nhiều yếu tố cùng góp phần vào sự hình thành lý luận, thay vì quy về một nguyên nhân duy nhất.",
    "keyTakeaways": [
      "Phân biệt điều kiện kinh tế – xã hội, tiền đề khoa học tự nhiên và tiền đề tư tưởng – lý luận.",
      "Sự hình thành CNXH khoa học gắn với nhiều tiền đề và bối cảnh lịch sử."
    ],
    "source": {
      "book": "Giáo trình Chủ nghĩa xã hội khoa học (2021)",
      "chapter": 1,
      "printedPages": [
        12,
        13,
        14,
        15,
        16
      ],
      "pdfPages": [
        9,
        10,
        11,
        12,
        13
      ],
      "sourceReviewStatus": "needs-review"
    },
    "clueReward": {
      "id": "clue-r1-1",
      "name": "Mảnh bản đồ: Điều kiện",
      "description": "Các điều kiện kinh tế – xã hội phản ánh sự biến đổi của sản xuất và đời sống các giai cấp. Khoa học tự nhiên nghiên cứu quy luật của tự nhiên. Tiền đề tư tưởng – lý luận là những thành tựu học thuyết được tiếp thu có phê phán."
    },
    "groups": [
      {
        "id": "A",
        "label": "Điều kiện kinh tế – xã hội"
      },
      {
        "id": "B",
        "label": "Tiền đề khoa học tự nhiên"
      },
      {
        "id": "C",
        "label": "Tiền đề tư tưởng – lý luận"
      }
    ],
    "cards": [
      {
        "id": "r1p1-a1",
        "label": "Sự phát triển của đại công nghiệp",
        "correctGroupId": "A"
      },
      {
        "id": "r1p1-a2",
        "label": "Phong trào đấu tranh của giai cấp công nhân",
        "correctGroupId": "A"
      },
      {
        "id": "r1p1-b1",
        "label": "Học thuyết tiến hóa",
        "correctGroupId": "B"
      },
      {
        "id": "r1p1-b2",
        "label": "Định luật bảo toàn và chuyển hóa năng lượng",
        "correctGroupId": "B"
      },
      {
        "id": "r1p1-c1",
        "label": "Triết học cổ điển Đức",
        "correctGroupId": "C"
      },
      {
        "id": "r1p1-c2",
        "label": "Kinh tế chính trị học cổ điển Anh",
        "correctGroupId": "C"
      }
    ]
  },
  {
    "id": "r1-p2",
    "roomId": 1,
    "order": 2,
    "type": "matching",
    "title": "Dấu ấn của các nhà lý luận",
    "hotspotName": "Bàn chân dung",
    "learningObjective": "nhận diện đóng góp và vị trí của các nhân vật/trào lưu trong quá trình hình thành, phát triển lý luận.",
    "instruction": "Chọn một hồ sơ bên trái, sau đó chọn mô tả tương ứng bên phải. Bạn có thể ghép lại.",
    "readingNote": "Hồ sơ lưu trữ phân biệt người đặt nền tảng, người vận dụng và phát triển, trào lưu tiền thân và tác phẩm. Mác – Ăngghen gắn với nền tảng lý luận; Lênin gắn với việc phát triển trong điều kiện mới. Những dự tưởng không tưởng có giá trị phê phán nhưng còn hạn chế. Tuyên ngôn là tác phẩm năm 1848.",
    "hints": [
      "Hãy phân biệt người đặt nền tảng lý luận, người vận dụng và phát triển, tác phẩm, và trào lưu tiền thân.",
      "Tuyên ngôn là một tác phẩm, không phải tên một tác giả."
    ],
    "explanation": "Giáo trình phân tích đóng góp của C. Mác và Ph. Ăngghen, sự vận dụng phát triển của V.I. Lênin và quan hệ kế thừa – vượt qua những giới hạn của các tư tưởng xã hội chủ nghĩa trước đó. Tuyên ngôn của Đảng Cộng sản năm 1848 là dấu mốc quan trọng. Khi đọc các hồ sơ, cần phân biệt nhân vật, trào lưu tư tưởng và tác phẩm. Sự kế thừa các tư tưởng trước đó luôn đi cùng việc xem xét những giới hạn của chúng. Vì vậy, quá trình hình thành và phát triển không chỉ là tập hợp tên tuổi, mà còn là nhận biết đóng góp và bối cảnh của từng yếu tố. Ghép đúng giúp người học đặt các thông tin vào quan hệ phù hợp.",
    "keyTakeaways": [
      "Mác và Ăngghen đặt nền tảng; Lênin tiếp tục vận dụng và phát triển CNXH khoa học.",
      "Tuyên ngôn của Đảng Cộng sản xuất bản năm 1848 là một dấu mốc quan trọng."
    ],
    "source": {
      "book": "Giáo trình Chủ nghĩa xã hội khoa học (2021)",
      "chapter": 1,
      "printedPages": [
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27
      ],
      "pdfPages": [
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24
      ],
      "sourceReviewStatus": "needs-review"
    },
    "clueReward": {
      "id": "clue-r1-2",
      "name": "Con dấu: Những người đặt nền tảng",
      "description": "Hồ sơ lưu trữ phân biệt người đặt nền tảng, người vận dụng và phát triển, trào lưu tiền thân và tác phẩm. Mác – Ăngghen gắn với nền tảng lý luận; Lênin gắn với việc phát triển trong điều kiện mới. Những dự tưởng không tưởng có giá trị phê phán nhưng còn hạn chế. Tuyên ngôn là tác phẩm năm 1848."
    },
    "pairs": [
      {
        "id": "r1-p2-pair-1",
        "left": "C. Mác và Ph. Ăngghen",
        "right": "Xây dựng những cơ sở lý luận của chủ nghĩa xã hội khoa học"
      },
      {
        "id": "r1-p2-pair-2",
        "left": "V.I. Lênin",
        "right": "Vận dụng và phát triển CNXH khoa học trong điều kiện lịch sử mới"
      },
      {
        "id": "r1-p2-pair-3",
        "left": "Những nhà tư tưởng xã hội chủ nghĩa không tưởng – phê phán",
        "right": "Đưa ra nhiều phê phán xã hội và dự tưởng tiến bộ nhưng còn những giới hạn lý luận"
      },
      {
        "id": "r1-p2-pair-4",
        "left": "Tuyên ngôn của Đảng Cộng sản",
        "right": "Tác phẩm xuất bản năm 1848, đánh dấu mốc quan trọng trong sự hình thành CNXH khoa học"
      }
    ]
  },
  {
    "id": "r1-p3",
    "roomId": 1,
    "order": 3,
    "type": "timeline",
    "title": "Đồng hồ lịch sử",
    "hotspotName": "Đồng hồ thời gian",
    "learningObjective": "xác định thứ tự một số dấu mốc lịch sử được nêu trong giáo trình.",
    "instruction": "Dùng nút lên hoặc xuống để sắp các sự kiện theo năm tăng dần.",
    "readingNote": "Mỗi bánh răng ghi năm diễn ra sự kiện. Thế kỷ XIX đứng trước thế kỷ XX; trong cùng một thế kỷ, năm nhỏ hơn đứng trước. Sắp xếp theo thời gian, không xếp theo mức độ quan trọng.",
    "hints": [
      "Hãy xếp từ giữa thế kỷ XIX đến cuối thế kỷ XX.",
      "Mốc 1848 đứng trước Công xã Paris; Đổi mới 1986 là mốc muộn nhất."
    ],
    "explanation": "Các dấu mốc này cho phép người chơi nhìn thấy tiến trình từ sự ra đời lý luận, những sự kiện lịch sử và quá trình vận dụng, phát triển trong những điều kiện cụ thể. Không được suy ra rằng những sự kiện này có cùng ý nghĩa hoặc diễn ra theo một cơ chế đơn tuyến. Trật tự thời gian là công cụ để định vị các sự kiện, không phải bằng chứng tự động về quan hệ nhân quả. Tác phẩm lý luận, một sự kiện cách mạng và công cuộc đổi mới có bối cảnh, nội dung khác nhau. Khi đọc dòng thời gian, hãy vừa ghi nhớ năm, vừa phân biệt loại sự kiện. Cách đọc này tránh việc đồng nhất các mốc chỉ vì chúng cùng xuất hiện trong một chương học.",
    "keyTakeaways": [
      "Thứ tự các mốc trong câu đố là 1848, 1871, 1917 và 1986.",
      "Thứ tự thời gian giúp định vị sự kiện, không tự chứng minh quan hệ nhân quả."
    ],
    "source": {
      "book": "Giáo trình Chủ nghĩa xã hội khoa học (2021)",
      "chapter": 1,
      "printedPages": [
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35
      ],
      "pdfPages": [
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32
      ],
      "sourceReviewStatus": "needs-review"
    },
    "clueReward": {
      "id": "clue-r1-3",
      "name": "Bánh răng: Dòng thời gian",
      "description": "Mỗi bánh răng ghi năm diễn ra sự kiện. Thế kỷ XIX đứng trước thế kỷ XX; trong cùng một thế kỷ, năm nhỏ hơn đứng trước. Sắp xếp theo thời gian, không xếp theo mức độ quan trọng."
    },
    "events": [
      {
        "id": "r1-p3-event-1",
        "year": 1848,
        "label": "Tuyên ngôn của Đảng Cộng sản ra đời."
      },
      {
        "id": "r1-p3-event-2",
        "year": 1871,
        "label": "Công xã Paris."
      },
      {
        "id": "r1-p3-event-3",
        "year": 1917,
        "label": "Cách mạng Tháng Mười Nga."
      },
      {
        "id": "r1-p3-event-4",
        "year": 1986,
        "label": "Việt Nam bắt đầu công cuộc Đổi mới."
      }
    ]
  },
  {
    "id": "r1-p4",
    "roomId": 1,
    "order": 4,
    "type": "evidence-lock",
    "title": "Cánh cửa bản thảo",
    "hotspotName": "Khóa cửa thư viện",
    "learningObjective": "phân biệt các nhận định được giáo trình hỗ trợ và nhận định sai.",
    "instruction": "Từ 3 manh mối vừa thu thập, kích hoạt đúng những bản ghi đáng tin cậy để mở khóa.",
    "readingNote": "Ba vật phẩm ghi lại các nhóm tiền đề, đóng góp của các nhà lý luận và mốc 1848. Kế thừa có phê phán nghĩa là tiếp nhận giá trị và khắc phục giới hạn. Phong trào công nhân thuộc bối cảnh kinh tế – xã hội của sự ra đời lý luận.",
    "hints": [
      "Đối chiếu nội dung 3 tài liệu đã nhận: nguồn gốc, các nhà lý luận, dòng thời gian.",
      "Nhận định dùng các từ ‘không có liên hệ gì’ hoặc ‘chỉ sao chép nguyên vẹn’ cần được kiểm chứng kỹ."
    ],
    "explanation": "Các tiền đề khách quan và lý luận, vai trò của C. Mác – Ph. Ăngghen, sự phát triển của V.I. Lênin và dấu mốc 1848 là những phần liên quan của Chương 1. Giáo trình cho thấy sự kế thừa có phê phán, không phải sao chép nguyên vẹn tư tưởng trước đó. Ba manh mối trong phòng bổ sung cho nhau: nguồn gốc cho biết bối cảnh, hồ sơ cho biết đóng góp, đồng hồ giúp định vị thời gian. Khi đánh giá một nhận định, hãy kiểm tra toàn bộ ý nghĩa của nó, đặc biệt là các khẳng định tuyệt đối. Có yếu tố kế thừa không có nghĩa là sao chép nguyên vẹn; nhấn mạnh vai trò lý luận cũng không có nghĩa là tách rời thực tiễn xã hội.",
    "keyTakeaways": [
      "Các tiền đề khách quan và lý luận cùng góp phần vào sự ra đời CNXH khoa học.",
      "Kế thừa có phê phán khác với sao chép nguyên vẹn những tư tưởng trước đó."
    ],
    "source": {
      "book": "Giáo trình Chủ nghĩa xã hội khoa học (2021)",
      "chapter": 1,
      "printedPages": [
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27
      ],
      "pdfPages": [
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24
      ],
      "sourceReviewStatus": "needs-review"
    },
    "statements": [
      {
        "id": "r1p4-t1",
        "text": "CNXH khoa học ra đời gắn với những điều kiện kinh tế – xã hội và các tiền đề khoa học, lý luận.",
        "supported": true
      },
      {
        "id": "r1p4-t2",
        "text": "Tuyên ngôn của Đảng Cộng sản ra đời năm 1848.",
        "supported": true
      },
      {
        "id": "r1p4-t3",
        "text": "V.I. Lênin tiếp tục vận dụng và phát triển CNXH khoa học.",
        "supported": true
      },
      {
        "id": "r1p4-f1",
        "text": "CNXH khoa học không có liên hệ gì với phong trào công nhân.",
        "supported": false
      },
      {
        "id": "r1p4-f2",
        "text": "CNXH khoa học chỉ sao chép nguyên vẹn CNXH không tưởng – phê phán.",
        "supported": false
      }
    ]
  },
  {
    "id": "r2-p1",
    "roomId": 2,
    "order": 1,
    "type": "classification",
    "title": "Hai lăng kính về giai cấp công nhân",
    "hotspotName": "Hồ sơ lao động",
    "learningObjective": "Phân biệt và giải thích nội dung: hai lăng kính về giai cấp công nhân.",
    "instruction": "Chọn một thẻ, sau đó chọn nhóm phù hợp. Phân loại đủ các thẻ để kiểm tra.",
    "readingNote": "Lăng kính kinh tế – xã hội xem xét phương thức lao động và vị trí trong sản xuất công nghiệp. Lăng kính chính trị – xã hội trong CNTB xem xét sở hữu tư liệu sản xuất, quan hệ bán sức lao động và lợi ích giai cấp.",
    "hints": [
      "Một nhóm nói về cách người lao động tham gia sản xuất; nhóm kia nói về vị trí trong quan hệ xã hội.",
      "Phương thức lao động công nghiệp là dấu hiệu kinh tế – xã hội."
    ],
    "explanation": "Giáo trình tiếp cận khái niệm giai cấp công nhân từ hai phương diện: vai trò trong nền sản xuất công nghiệp hiện đại và địa vị chính trị – xã hội trong quan hệ sản xuất tư bản chủ nghĩa. Không được đồng nhất mọi nghề sử dụng máy tính với giai cấp công nhân. Hai phương diện là hai cách xem xét cùng một đối tượng. Phương diện thứ nhất hướng đến hoạt động sản xuất, trong khi phương diện thứ hai hướng đến vị trí và quan hệ xã hội trong bối cảnh chủ nghĩa tư bản. Khi phân loại, cần đọc đủ điều kiện của phát biểu. Chỉ dựa vào công cụ lao động hoặc tên nghề riêng lẻ sẽ không thể thay thế cách tiếp cận có nhiều phương diện của giáo trình.",
    "keyTakeaways": [
      "Phương diện kinh tế – xã hội xem xét phương thức lao động và vị trí trong sản xuất công nghiệp.",
      "Phương diện chính trị – xã hội trong CNTB xem xét sở hữu, bán sức lao động và lợi ích giai cấp."
    ],
    "source": {
      "book": "Giáo trình Chủ nghĩa xã hội khoa học (2021)",
      "chapter": 2,
      "printedPages": [
        52,
        53,
        54,
        55
      ],
      "pdfPages": [
        49,
        50,
        51,
        52
      ],
      "sourceReviewStatus": "needs-review"
    },
    "clueReward": {
      "id": "clue-r2-1",
      "name": "Hồ sơ: Hai phương diện",
      "description": "Lăng kính kinh tế – xã hội xem xét phương thức lao động và vị trí trong sản xuất công nghiệp. Lăng kính chính trị – xã hội trong CNTB xem xét sở hữu tư liệu sản xuất, quan hệ bán sức lao động và lợi ích giai cấp."
    },
    "groups": [
      {
        "id": "A",
        "label": "Phương diện kinh tế – xã hội"
      },
      {
        "id": "B",
        "label": "Phương diện chính trị – xã hội trong CNTB"
      }
    ],
    "cards": [
      {
        "id": "r2p1-a1",
        "label": "Lao động theo phương thức công nghiệp",
        "correctGroupId": "A"
      },
      {
        "id": "r2p1-a2",
        "label": "Trực tiếp hoặc gián tiếp vận hành công cụ sản xuất có tính công nghiệp, xã hội hóa",
        "correctGroupId": "A"
      },
      {
        "id": "r2p1-b1",
        "label": "Trong CNTB, người công nhân chủ yếu không sở hữu tư liệu sản xuất chủ yếu",
        "correctGroupId": "B"
      },
      {
        "id": "r2p1-b2",
        "label": "Trong CNTB, công nhân bán sức lao động và có lợi ích cơ bản đối lập với giai cấp tư sản",
        "correctGroupId": "B"
      }
    ]
  },
  {
    "id": "r2-p2",
    "roomId": 2,
    "order": 2,
    "type": "matching",
    "title": "Ba hệ thống sứ mệnh",
    "hotspotName": "Bảng vận hành",
    "learningObjective": "nối ba nhóm nội dung sứ mệnh lịch sử với nội dung diễn giải phù hợp.",
    "instruction": "Chọn một hồ sơ bên trái, sau đó chọn mô tả tương ứng bên phải. Bạn có thể ghép lại.",
    "readingNote": "Bảng vận hành có ba hệ thống: kinh tế nói về sản xuất và cơ sở vật chất; chính trị – xã hội nói về quyền lực, tổ chức xã hội; văn hóa – tư tưởng nói về các giá trị và đời sống tinh thần.",
    "hints": [
      "Một nội dung nói về sản xuất; một nội dung nói về quyền lực và tổ chức xã hội; một nội dung nói về giá trị tư tưởng.",
      "Văn hóa – tư tưởng không phải là nhiệm vụ xây dựng máy móc."
    ],
    "explanation": "Theo Chương 2, nội dung sứ mệnh lịch sử được trình bày trên các mặt kinh tế, chính trị – xã hội và văn hóa – tư tưởng. Sự phân chia giúp người học nhận thấy đây là hệ thống nội dung nhiều chiều, không chỉ là lao động sản xuất. Mỗi mặt nội dung có trọng tâm riêng, đồng thời có liên hệ với các mặt khác. Phát triển cơ sở vật chất không thể thay thế toàn bộ vấn đề về tổ chức xã hội hoặc đời sống tinh thần. Khi ghép mô tả, hãy tìm đối tượng chính mà câu đang nói tới. Đây là cách đọc theo phương diện phân tích, không phải chia tách thực tiễn thành những phần hoàn toàn độc lập với nhau.",
    "keyTakeaways": [
      "Sứ mệnh lịch sử được trình bày trên các mặt kinh tế, chính trị – xã hội và văn hóa – tư tưởng.",
      "Các mặt có trọng tâm riêng nhưng liên hệ với nhau, không chỉ giới hạn ở sản xuất vật chất."
    ],
    "source": {
      "book": "Giáo trình Chủ nghĩa xã hội khoa học (2021)",
      "chapter": 2,
      "printedPages": [
        57,
        58,
        59
      ],
      "pdfPages": [
        54,
        55,
        56
      ],
      "sourceReviewStatus": "needs-review"
    },
    "clueReward": {
      "id": "clue-r2-2",
      "name": "Bộ điều khiển: Ba nội dung",
      "description": "Bảng vận hành có ba hệ thống: kinh tế nói về sản xuất và cơ sở vật chất; chính trị – xã hội nói về quyền lực, tổ chức xã hội; văn hóa – tư tưởng nói về các giá trị và đời sống tinh thần."
    },
    "pairs": [
      {
        "id": "r2-p2-pair-1",
        "left": "Kinh tế",
        "right": "Góp phần phát triển lực lượng sản xuất và cơ sở vật chất cho xã hội mới"
      },
      {
        "id": "r2-p2-pair-2",
        "left": "Chính trị – xã hội",
        "right": "Vai trò trong biến đổi chính trị và tổ chức xây dựng xã hội theo lý luận của giáo trình"
      },
      {
        "id": "r2-p2-pair-3",
        "left": "Văn hóa – tư tưởng",
        "right": "Xây dựng, phát triển các giá trị và đời sống tinh thần phù hợp mục tiêu xã hội mới"
      }
    ]
  },
  {
    "id": "r2-p3",
    "roomId": 2,
    "order": 3,
    "type": "classification",
    "title": "Cơ chế kích hoạt",
    "hotspotName": "Thiết bị phân tích",
    "learningObjective": "Phân biệt và giải thích nội dung: cơ chế kích hoạt.",
    "instruction": "Chọn một thẻ, sau đó chọn nhóm phù hợp. Phân loại đủ các thẻ để kiểm tra.",
    "readingNote": "Khách quan là những điều kiện gắn với địa vị kinh tế, chính trị – xã hội trong cơ cấu xã hội. Chủ quan là sự phát triển của bản thân giai cấp về số lượng, chất lượng và vai trò tổ chức, lãnh đạo của Đảng Cộng sản.",
    "hints": [
      "Khách quan nói về địa vị và điều kiện do cơ cấu xã hội quy định; chủ quan nói về sự phát triển và tổ chức lực lượng.",
      "Vai trò của tổ chức lãnh đạo thuộc nhóm điều kiện chủ quan trong giáo trình."
    ],
    "explanation": "Giáo trình phân biệt những điều kiện khách quan gắn với địa vị kinh tế, chính trị – xã hội của giai cấp công nhân và những điều kiện chủ quan về sự phát triển của giai cấp, vai trò tổ chức chính trị. Sự phân biệt khách quan và chủ quan giúp nhận diện cơ sở xã hội và vai trò của hoạt động có tổ chức. Có điều kiện khách quan không có nghĩa là mọi kết quả tự xuất hiện mà không cần sự phát triển của lực lượng thực hiện. Ngược lại, việc tổ chức hoạt động cần được xem xét trong những điều kiện lịch sử cụ thể. Người học cần đặt cả hai nhóm trong quan hệ với nhau khi lý giải nội dung của chương.",
    "keyTakeaways": [
      "Điều kiện khách quan gắn với địa vị kinh tế và chính trị – xã hội của giai cấp công nhân.",
      "Điều kiện chủ quan gồm sự phát triển của giai cấp công nhân và vai trò tổ chức, lãnh đạo."
    ],
    "source": {
      "book": "Giáo trình Chủ nghĩa xã hội khoa học (2021)",
      "chapter": 2,
      "printedPages": [
        60,
        61,
        62,
        63,
        64
      ],
      "pdfPages": [
        57,
        58,
        59,
        60,
        61
      ],
      "sourceReviewStatus": "needs-review"
    },
    "clueReward": {
      "id": "clue-r2-3",
      "name": "Mạch điện: Điều kiện thực hiện",
      "description": "Khách quan là những điều kiện gắn với địa vị kinh tế, chính trị – xã hội trong cơ cấu xã hội. Chủ quan là sự phát triển của bản thân giai cấp về số lượng, chất lượng và vai trò tổ chức, lãnh đạo của Đảng Cộng sản."
    },
    "groups": [
      {
        "id": "A",
        "label": "Điều kiện khách quan"
      },
      {
        "id": "B",
        "label": "Điều kiện chủ quan"
      }
    ],
    "cards": [
      {
        "id": "r2p3-a1",
        "label": "Địa vị kinh tế của giai cấp công nhân",
        "correctGroupId": "A"
      },
      {
        "id": "r2p3-a2",
        "label": "Địa vị chính trị – xã hội của giai cấp công nhân",
        "correctGroupId": "A"
      },
      {
        "id": "r2p3-b1",
        "label": "Sự phát triển về số lượng và chất lượng của bản thân giai cấp công nhân",
        "correctGroupId": "B"
      },
      {
        "id": "r2p3-b2",
        "label": "Vai trò của Đảng Cộng sản trong tổ chức, lãnh đạo",
        "correctGroupId": "B"
      }
    ]
  },
  {
    "id": "r2-p4",
    "roomId": 2,
    "order": 4,
    "type": "evidence-lock",
    "title": "Khóa nhà máy hiện đại",
    "hotspotName": "Tủ điều khiển chính",
    "learningObjective": "nhận diện những biến đổi của giai cấp công nhân hiện nay theo giáo trình.",
    "instruction": "Đọc ba manh mối và tài liệu tại khóa. Chỉ kích hoạt các bản ghi được nguồn hỗ trợ.",
    "readingNote": "Tài liệu bảo trì bổ sung: giáo trình đề cập xu hướng trí thức hóa nhanh và trung lưu hóa ở một bộ phận công nhân. Lao động với công nghệ hiện đại cần tri thức, kỹ năng. Biến đổi cơ cấu và đời sống không đồng nghĩa với sự biến mất hoàn toàn của giai cấp công nhân.",
    "hints": [
      "Quan sát manh mối về phương thức lao động và điều kiện phát triển của giai cấp công nhân.",
      "Hai khẳng định phủ nhận hoàn toàn vai trò tri thức và sự tồn tại của công nhân cần được xem lại."
    ],
    "explanation": "Giáo trình nhấn mạnh những biến đổi của giai cấp công nhân trong điều kiện khoa học – công nghệ hiện đại, trong đó có xu hướng trí thức hóa và một số biến đổi về cơ cấu, đời sống. Vì vậy không thể đồng nhất giai cấp công nhân với hình ảnh lao động chân tay duy nhất. Ở đây cần phân biệt sự biến đổi đặc điểm với sự phủ nhận sự tồn tại. Công nghệ và phương thức lao động thay đổi làm xuất hiện yêu cầu mới về trình độ, nhưng không cho phép suy ra một kết luận tuyệt đối cho mọi người lao động. Khái niệm một bộ phận cũng khác với toàn bộ giai cấp. Khi kiểm chứng chứng cứ, cần giữ đúng phạm vi và mức độ của nhận định trong nguồn.",
    "keyTakeaways": [
      "Giáo trình đề cập xu hướng trí thức hóa và trung lưu hóa ở một bộ phận công nhân.",
      "Biến đổi phương thức lao động không đồng nghĩa với giai cấp công nhân hoàn toàn biến mất."
    ],
    "source": {
      "book": "Giáo trình Chủ nghĩa xã hội khoa học (2021)",
      "chapter": 2,
      "printedPages": [
        65,
        66,
        67,
        68
      ],
      "pdfPages": [
        62,
        63,
        64,
        65
      ],
      "sourceReviewStatus": "needs-review"
    },
    "statements": [
      {
        "id": "r2p4-t1",
        "text": "Xu hướng trí thức hóa của giai cấp công nhân diễn ra nhanh.",
        "supported": true
      },
      {
        "id": "r2p4-t2",
        "text": "Công nghệ hiện đại khiến nhiều công việc công nghiệp yêu cầu kỹ năng và tri thức cao hơn.",
        "supported": true
      },
      {
        "id": "r2p4-t3",
        "text": "Giáo trình có đề cập xu hướng trung lưu hóa của một bộ phận giai cấp công nhân.",
        "supported": true
      },
      {
        "id": "r2p4-f1",
        "text": "Máy móc hiện đại làm cho giai cấp công nhân hoàn toàn biến mất.",
        "supported": false
      },
      {
        "id": "r2p4-f2",
        "text": "Công nhân hiện đại chỉ có thể là lao động cơ bắp, không liên quan tri thức.",
        "supported": false
      }
    ]
  },
  {
    "id": "r3-p1",
    "roomId": 3,
    "order": 1,
    "type": "matching",
    "title": "Bản thiết kế xã hội",
    "hotspotName": "Sa bàn thành phố",
    "learningObjective": "ghép đặc trưng của CNXH với mô tả được nêu trong giáo trình.",
    "instruction": "Chọn một hồ sơ bên trái, sau đó chọn mô tả tương ứng bên phải. Bạn có thể ghép lại.",
    "readingNote": "Sa bàn có các lớp thông tin về chủ thể làm chủ, nền kinh tế, văn hóa và quan hệ dân tộc. Tìm từ khóa trung tâm của mỗi mô tả: người lao động, lực lượng sản xuất và sở hữu, giá trị văn hóa, hoặc sự hợp tác giữa các dân tộc.",
    "hints": [
      "Mỗi thẻ đặc trưng nói về một phương diện: chủ thể làm chủ, kinh tế, văn hóa, dân tộc.",
      "Lực lượng sản xuất hiện đại là dấu hiệu thuộc phương diện kinh tế."
    ],
    "explanation": "Theo lý luận được trình bày ở Chương 3, CNXH có những đặc trưng gắn với quyền làm chủ, nền kinh tế, văn hóa và quan hệ giữa các dân tộc. Đây là một hệ thống đặc trưng, không phải chỉ là một tiêu chí đơn lẻ. Những thẻ trong câu đố chọn một số đặc trưng để người học bước đầu nhận diện, không thay thế toàn bộ nội dung của chương. Khi ghép, cần xem mô tả đang làm rõ chủ thể, cơ sở kinh tế hay một phương diện của đời sống xã hội. Các đặc trưng có liên hệ và được trình bày trong hệ thống lý luận của giáo trình, vì vậy không nên tách một thẻ thành định nghĩa đầy đủ về chủ nghĩa xã hội.",
    "keyTakeaways": [
      "Quyền làm chủ, kinh tế, văn hóa và quan hệ dân tộc là những phương diện của hệ thống đặc trưng.",
      "Các thẻ trong câu đố chỉ chọn một số đặc trưng, không thay thế toàn bộ nội dung chương."
    ],
    "source": {
      "book": "Giáo trình Chủ nghĩa xã hội khoa học (2021)",
      "chapter": 3,
      "printedPages": [
        93,
        94,
        95,
        96,
        97,
        98,
        99,
        100,
        101,
        102,
        103
      ],
      "pdfPages": [
        90,
        91,
        92,
        93,
        94,
        95,
        96,
        97,
        98,
        99,
        100
      ],
      "sourceReviewStatus": "needs-review"
    },
    "clueReward": {
      "id": "clue-r3-1",
      "name": "Mô hình: Những đặc trưng",
      "description": "Sa bàn có các lớp thông tin về chủ thể làm chủ, nền kinh tế, văn hóa và quan hệ dân tộc. Tìm từ khóa trung tâm của mỗi mô tả: người lao động, lực lượng sản xuất và sở hữu, giá trị văn hóa, hoặc sự hợp tác giữa các dân tộc."
    },
    "pairs": [
      {
        "id": "r3-p1-pair-1",
        "left": "Nhân dân lao động làm chủ",
        "right": "Đặc trưng về vai trò làm chủ của người lao động trong xã hội"
      },
      {
        "id": "r3-p1-pair-2",
        "left": "Nền kinh tế phát triển cao",
        "right": "Dựa trên lực lượng sản xuất hiện đại và chế độ công hữu về tư liệu sản xuất chủ yếu"
      },
      {
        "id": "r3-p1-pair-3",
        "left": "Nền văn hóa phát triển cao",
        "right": "Kế thừa, phát huy những giá trị văn hóa dân tộc và tinh hoa nhân loại"
      },
      {
        "id": "r3-p1-pair-4",
        "left": "Bình đẳng, đoàn kết giữa các dân tộc",
        "right": "Các dân tộc hợp tác, tôn trọng và giúp đỡ lẫn nhau"
      }
    ]
  },
  {
    "id": "r3-p2",
    "roomId": 3,
    "order": 2,
    "type": "classification",
    "title": "Hai lối chuyển tiếp",
    "hotspotName": "Hai cánh cổng",
    "learningObjective": "phân biệt quá độ trực tiếp và quá độ gián tiếp theo cách phân chia trong giáo trình.",
    "instruction": "Chọn một thẻ, sau đó chọn nhóm phù hợp. Phân loại đủ các thẻ để kiểm tra.",
    "readingNote": "Hai cổng phân biệt theo điểm xuất phát. Quá độ trực tiếp gắn với CNTB đã phát triển cao; quá độ gián tiếp gắn với xã hội mà CNTB chưa phát triển cao, với những bước và hình thức trung gian phù hợp.",
    "hints": [
      "Tiêu chí phân biệt nằm ở trình độ phát triển và điểm xuất phát lịch sử.",
      "Trực tiếp được mô tả gắn với CNTB phát triển ở trình độ cao."
    ],
    "explanation": "Chương 3 phân biệt quá độ trực tiếp và gián tiếp dựa trên điều kiện lịch sử, trình độ phát triển của xã hội xuất phát. Các con đường không thể được trình bày như một lộ trình máy móc giống hệt nhau ở mọi quốc gia. Từ trực tiếp và gián tiếp trong câu đố chỉ hình thức quá độ theo điều kiện xuất phát mà giáo trình phân tích. Chúng không phải là lời khẳng định rằng mọi quốc gia sẽ trải qua cùng một lịch trình với cùng tốc độ. Khi lựa chọn cổng, cần dựa vào dấu hiệu về trình độ phát triển và bối cảnh lịch sử, tránh đánh đồng tên gọi với sự đơn giản hoặc dễ dàng của quá trình chuyển đổi.",
    "keyTakeaways": [
      "Quá độ trực tiếp và gián tiếp được phân biệt theo điều kiện lịch sử và điểm xuất phát.",
      "Không thể áp dụng một lộ trình máy móc giống nhau cho mọi quốc gia."
    ],
    "source": {
      "book": "Giáo trình Chủ nghĩa xã hội khoa học (2021)",
      "chapter": 3,
      "printedPages": [
        104,
        105,
        106
      ],
      "pdfPages": [
        101,
        102,
        103
      ],
      "sourceReviewStatus": "needs-review"
    },
    "clueReward": {
      "id": "clue-r3-2",
      "name": "Bản đồ: Điểm xuất phát",
      "description": "Hai cổng phân biệt theo điểm xuất phát. Quá độ trực tiếp gắn với CNTB đã phát triển cao; quá độ gián tiếp gắn với xã hội mà CNTB chưa phát triển cao, với những bước và hình thức trung gian phù hợp."
    },
    "groups": [
      {
        "id": "A",
        "label": "Quá độ trực tiếp"
      },
      {
        "id": "B",
        "label": "Quá độ gián tiếp"
      }
    ],
    "cards": [
      {
        "id": "r3p2-a1",
        "label": "Xuất phát từ chủ nghĩa tư bản đã phát triển ở trình độ cao",
        "correctGroupId": "A"
      },
      {
        "id": "r3p2-a2",
        "label": "Hình thức quá độ được giáo trình gắn với các nước đã trải qua CNTB phát triển",
        "correctGroupId": "A"
      },
      {
        "id": "r3p2-b1",
        "label": "Xuất phát từ xã hội mà CNTB chưa phát triển cao",
        "correctGroupId": "B"
      },
      {
        "id": "r3p2-b2",
        "label": "Có thể cần những bước phát triển và hình thức trung gian thích hợp với điều kiện lịch sử",
        "correctGroupId": "B"
      }
    ]
  },
  {
    "id": "r3-p3",
    "roomId": 3,
    "order": 3,
    "type": "matching",
    "title": "Bốn lĩnh vực chuyển đổi",
    "hotspotName": "Bảng mô phỏng",
    "learningObjective": "liên hệ đặc điểm của thời kỳ quá độ với lĩnh vực tương ứng.",
    "instruction": "Chọn một hồ sơ bên trái, sau đó chọn mô tả tương ứng bên phải. Bạn có thể ghép lại.",
    "readingNote": "Sở hữu và thành phần kinh tế thuộc kinh tế. Tổ chức và thiết chế quyền lực thuộc chính trị. Hệ tư tưởng, giá trị thuộc tư tưởng – văn hóa. Giai cấp, tầng lớp và quan hệ giữa họ thuộc lĩnh vực xã hội.",
    "hints": [
      "Nhìn vào đối tượng chính được nhắc tới: sở hữu, thiết chế, hệ giá trị hay tầng lớp xã hội.",
      "Nhiều thành phần kinh tế thuộc lĩnh vực kinh tế."
    ],
    "explanation": "Giáo trình mô tả thời kỳ quá độ là giai đoạn tồn tại nhiều đặc điểm đan xen trên các lĩnh vực kinh tế, chính trị, tư tưởng – văn hóa và xã hội. Đây không phải tình trạng mọi yếu tố xã hội cũ lập tức biến mất. Các lĩnh vực là những góc nhìn giúp phân tích tính phức tạp của thời kỳ quá độ. Một sự biến đổi trong thực tế có thể liên quan nhiều lĩnh vực, nhưng câu đố yêu cầu ghép theo trọng tâm của từng mô tả. Việc tồn tại những yếu tố khác nhau cho thấy quá trình chuyển đổi diễn ra trong điều kiện cụ thể, chứ không phải thay đổi mọi mặt ngay lập tức hoặc theo một khuôn mẫu duy nhất.",
    "keyTakeaways": [
      "Thời kỳ quá độ có những đặc điểm đan xen trong kinh tế, chính trị, tư tưởng – văn hóa và xã hội.",
      "Phân biệt lĩnh vực dựa trên đối tượng chính trong từng mô tả."
    ],
    "source": {
      "book": "Giáo trình Chủ nghĩa xã hội khoa học (2021)",
      "chapter": 3,
      "printedPages": [
        107,
        108,
        109
      ],
      "pdfPages": [
        104,
        105,
        106
      ],
      "sourceReviewStatus": "needs-review"
    },
    "clueReward": {
      "id": "clue-r3-3",
      "name": "Bộ dữ liệu: Bốn lĩnh vực",
      "description": "Sở hữu và thành phần kinh tế thuộc kinh tế. Tổ chức và thiết chế quyền lực thuộc chính trị. Hệ tư tưởng, giá trị thuộc tư tưởng – văn hóa. Giai cấp, tầng lớp và quan hệ giữa họ thuộc lĩnh vực xã hội."
    },
    "pairs": [
      {
        "id": "r3-p3-pair-1",
        "left": "Kinh tế",
        "right": "Tồn tại nhiều thành phần kinh tế và hình thức sở hữu trong quá trình chuyển đổi"
      },
      {
        "id": "r3-p3-pair-2",
        "left": "Chính trị",
        "right": "Những biến đổi về tổ chức, thiết chế và quan hệ chính trị"
      },
      {
        "id": "r3-p3-pair-3",
        "left": "Tư tưởng – văn hóa",
        "right": "Cùng tồn tại các hệ tư tưởng, giá trị và hoạt động xây dựng đời sống văn hóa mới"
      },
      {
        "id": "r3-p3-pair-4",
        "left": "Xã hội",
        "right": "Tồn tại nhiều giai cấp, tầng lớp và các quan hệ xã hội đa dạng"
      }
    ]
  },
  {
    "id": "r3-p4",
    "roomId": 3,
    "order": 4,
    "type": "evidence-lock",
    "title": "Mật mã “bỏ qua”",
    "hotspotName": "Máy tính trung tâm",
    "learningObjective": "phân biệt đúng – sai trong cách hiểu quan điểm quá độ lên CNXH bỏ qua chế độ TBCN ở Việt Nam theo giáo trình.",
    "instruction": "Đọc ba manh mối và tài liệu tại khóa. Chỉ kích hoạt các bản ghi được nguồn hỗ trợ.",
    "readingNote": "Bản ghi trung tâm bổ sung: “bỏ qua chế độ” nói đến việc không xác lập vị trí thống trị của quan hệ sản xuất và kiến trúc thượng tầng TBCN. Giáo trình đồng thời nhấn mạnh tiếp thu, kế thừa thành tựu nhân loại, nhất là khoa học – công nghệ. Những bước trung gian không bị phủ nhận chỉ bởi từ “bỏ qua”.",
    "hints": [
      "Đọc lại manh mối từ hai lối chuyển tiếp và bốn lĩnh vực chuyển đổi.",
      "Hãy phân biệt ‘bỏ qua chế độ’ với ‘bỏ qua toàn bộ thành tựu’."
    ],
    "explanation": "Tr. 110–112 của giáo trình nhấn mạnh rằng “bỏ qua chế độ tư bản chủ nghĩa” không phải phủ nhận mọi thành tựu của chủ nghĩa tư bản; nội dung bao gồm vấn đề vị trí thống trị của quan hệ sản xuất, kiến trúc thượng tầng và việc kế thừa thành tựu phù hợp. Câu đố không được tự mở rộng thành một kết luận chính sách nằm ngoài phạm vi nguồn. Điểm cần đọc kỹ là đối tượng của cụm từ bỏ qua. Bỏ qua một chế độ không đồng nhất với loại bỏ mọi kết quả phát triển đã hình thành trong lịch sử. Nhận biết sự khác nhau này giúp tránh các kết luận cực đoan về khoa học, công nghệ hoặc hình thức trung gian. Câu đố chỉ diễn giải quan điểm trong các trang được dẫn và không dùng nó để suy ra những quyết định cụ thể ngoài phạm vi tài liệu.",
    "keyTakeaways": [
      "“Bỏ qua chế độ” nói đến vị trí thống trị của quan hệ sản xuất và kiến trúc thượng tầng TBCN.",
      "Quan điểm này không phủ nhận việc tiếp thu, kế thừa những thành tựu phù hợp của nhân loại."
    ],
    "source": {
      "book": "Giáo trình Chủ nghĩa xã hội khoa học (2021)",
      "chapter": 3,
      "printedPages": [
        110,
        111,
        112
      ],
      "pdfPages": [
        107,
        108,
        109
      ],
      "sourceReviewStatus": "needs-review"
    },
    "statements": [
      {
        "id": "r3p4-t1",
        "text": "“Bỏ qua” không đồng nghĩa với phủ nhận mọi thành tựu của nhân loại trong CNTB.",
        "supported": true
      },
      {
        "id": "r3p4-t2",
        "text": "Giáo trình nhấn mạnh việc không xác lập vị trí thống trị của quan hệ sản xuất và kiến trúc thượng tầng TBCN.",
        "supported": true
      },
      {
        "id": "r3p4-t3",
        "text": "Có thể tiếp thu, kế thừa những thành tựu khoa học – công nghệ và kinh nghiệm phù hợp.",
        "supported": true
      },
      {
        "id": "r3p4-f1",
        "text": "“Bỏ qua” nghĩa là không sử dụng bất kỳ thành tựu khoa học – công nghệ nào từng có trong CNTB.",
        "supported": false
      },
      {
        "id": "r3p4-f2",
        "text": "“Bỏ qua” nghĩa là thời kỳ quá độ không có những hình thức kinh tế, xã hội trung gian.",
        "supported": false
      }
    ]
  },
  {
    "id": "r4-p1",
    "roomId": 4,
    "order": 1,
    "type": "matching",
    "title": "Ba mặt của dân chủ",
    "hotspotName": "Bức tường khái niệm",
    "learningObjective": "nối ba phương diện mà giáo trình dùng để diễn giải dân chủ.",
    "instruction": "Chọn một hồ sơ bên trái, sau đó chọn mô tả tương ứng bên phải. Bạn có thể ghép lại.",
    "readingNote": "Ba lớp trên tường khái niệm xem xét dân chủ theo quyền lực thuộc về ai, theo hình thức tổ chức thực thi quyền lực trong xã hội và theo nguyên tắc tổ chức, quản lý. Một khái niệm có thể được nghiên cứu dưới nhiều phương diện.",
    "hints": [
      "Đây là ba góc nhìn của cùng một khái niệm, không phải ba khái niệm đối lập.",
      "Câu nói ‘quyền lực thuộc về nhân dân’ ứng với phương diện quyền lực."
    ],
    "explanation": "Giáo trình giới thiệu dân chủ không chỉ như một từ đồng nghĩa với bỏ phiếu, mà còn xét đến quyền lực, chế độ xã hội và phương diện nguyên tắc tổ chức, quản lý. Việc phân biệt giúp người chơi tránh cách hiểu một chiều. Ba phương diện không loại trừ nhau và không phải ba tên gọi cho các kiểu bỏ phiếu. Phân biệt chúng giúp người học xác định câu đang bàn về chủ thể quyền lực, hình thức tổ chức xã hội hay nguyên tắc trong hoạt động quản lý. Khi đọc một định nghĩa, cần chú ý phương diện đang được sử dụng. Nhờ đó việc giải thích dân chủ giữ được nhiều chiều cạnh thay vì thu hẹp vào một thao tác cụ thể.",
    "keyTakeaways": [
      "Có thể xem xét dân chủ theo quyền lực, chế độ xã hội và nguyên tắc tổ chức, quản lý.",
      "Ba phương diện là các góc nhìn của cùng một khái niệm, không phải ba kiểu bỏ phiếu."
    ],
    "source": {
      "book": "Giáo trình Chủ nghĩa xã hội khoa học (2021)",
      "chapter": 4,
      "printedPages": [
        126,
        127
      ],
      "pdfPages": [
        123,
        124
      ],
      "sourceReviewStatus": "needs-review"
    },
    "clueReward": {
      "id": "clue-r4-1",
      "name": "Biểu tượng: Ba phương diện",
      "description": "Ba lớp trên tường khái niệm xem xét dân chủ theo quyền lực thuộc về ai, theo hình thức tổ chức thực thi quyền lực trong xã hội và theo nguyên tắc tổ chức, quản lý. Một khái niệm có thể được nghiên cứu dưới nhiều phương diện."
    },
    "pairs": [
      {
        "id": "r4-p1-pair-1",
        "left": "Phương diện quyền lực",
        "right": "Quyền lực thuộc về nhân dân"
      },
      {
        "id": "r4-p1-pair-2",
        "left": "Phương diện chế độ xã hội / chính trị",
        "right": "Một hình thức tổ chức thực thi quyền lực trong xã hội"
      },
      {
        "id": "r4-p1-pair-3",
        "left": "Phương diện nguyên tắc tổ chức và quản lý",
        "right": "Nguyên tắc dân chủ được vận dụng vào tổ chức, quản lý xã hội"
      }
    ]
  },
  {
    "id": "r4-p2",
    "roomId": 4,
    "order": 2,
    "type": "classification",
    "title": "Ai là người tham gia quyết định?",
    "hotspotName": "Bàn biểu quyết",
    "learningObjective": "phân biệt hình thức dân chủ trực tiếp và gián tiếp qua tình huống minh họa.",
    "instruction": "Chọn một thẻ, sau đó chọn nhóm phù hợp. Phân loại đủ các thẻ để kiểm tra.",
    "readingNote": "Dân chủ trực tiếp nhấn mạnh người dân trực tiếp thực hiện quyền. Dân chủ gián tiếp được thực hiện thông qua đại biểu do người dân lựa chọn. Xét ai thực hiện hành vi quyết định trong mỗi tình huống, đồng thời chú ý phạm vi thẩm quyền và quy trình hợp lệ.",
    "hints": [
      "Xét xem người dân trực tiếp thực hiện quyền hay thông qua người đại diện.",
      "Có yếu tố bầu đại biểu đại diện thực hiện nhiệm vụ → cân nhắc nhóm gián tiếp."
    ],
    "explanation": "Trang 153 giới thiệu hình thức dân chủ trực tiếp và dân chủ gián tiếp, trong đó dân chủ gián tiếp được thực hiện qua những người đại diện được lựa chọn, còn dân chủ trực tiếp nhấn mạnh sự tham gia trực tiếp của người dân. Tình huống minh họa là do nhóm xây dựng, không phải ví dụ nguyên văn của sách; lưu ý thẩm quyền và pháp luật khi diễn giải. Việc lựa chọn hình thức cần dựa vào chủ thể thực hiện quyền trong tình huống được mô tả. Một người dân trực tiếp biểu quyết khác với một đại biểu thực hiện chức năng trong cơ quan đại diện. Hai hình thức không được hiểu là luôn loại trừ nhau. Các ví dụ trong trò chơi chỉ nhằm minh họa cách phân biệt khái niệm, không thay thế việc tìm hiểu điều kiện pháp lý hoặc thẩm quyền của một hoạt động ngoài thực tế.",
    "keyTakeaways": [
      "Dân chủ trực tiếp nhấn mạnh người dân trực tiếp thực hiện quyền.",
      "Dân chủ gián tiếp được thực hiện thông qua những người đại diện được lựa chọn."
    ],
    "source": {
      "book": "Giáo trình Chủ nghĩa xã hội khoa học (2021)",
      "chapter": 4,
      "printedPages": [
        153
      ],
      "pdfPages": [
        150
      ],
      "sourceReviewStatus": "needs-review"
    },
    "clueReward": {
      "id": "clue-r4-2",
      "name": "Thẻ: Hình thức thực hiện dân chủ",
      "description": "Dân chủ trực tiếp nhấn mạnh người dân trực tiếp thực hiện quyền. Dân chủ gián tiếp được thực hiện thông qua đại biểu do người dân lựa chọn. Xét ai thực hiện hành vi quyết định trong mỗi tình huống, đồng thời chú ý phạm vi thẩm quyền và quy trình hợp lệ."
    },
    "illustration": true,
    "groups": [
      {
        "id": "A",
        "label": "Dân chủ trực tiếp"
      },
      {
        "id": "B",
        "label": "Dân chủ gián tiếp / đại diện"
      }
    ],
    "cards": [
      {
        "id": "r4p2-a1",
        "label": "Người dân trực tiếp tham gia biểu quyết một vấn đề thuộc thẩm quyền và quy trình cho phép",
        "correctGroupId": "A"
      },
      {
        "id": "r4p2-a2",
        "label": "Người dân trực tiếp tham gia quyết định theo hình thức trưng cầu ý dân được tổ chức hợp lệ",
        "correctGroupId": "A"
      },
      {
        "id": "r4p2-b1",
        "label": "Người dân lựa chọn đại biểu để đại diện mình thực hiện chức năng theo quy định",
        "correctGroupId": "B"
      },
      {
        "id": "r4p2-b2",
        "label": "Đại biểu được bầu tham gia quyết định công việc trong phạm vi thẩm quyền của cơ quan đại diện",
        "correctGroupId": "B"
      }
    ]
  },
  {
    "id": "r4-p3",
    "roomId": 4,
    "order": 3,
    "type": "matching",
    "title": "Bản đồ chức năng Nhà nước",
    "hotspotName": "Tủ hồ sơ nhà nước",
    "learningObjective": "hiểu cách giáo trình phân chia chức năng Nhà nước XHCN theo những tiêu chí khác nhau.",
    "instruction": "Chọn một hồ sơ bên trái, sau đó chọn mô tả tương ứng bên phải. Bạn có thể ghép lại.",
    "readingNote": "Tủ hồ sơ có ba tiêu chí phân chia chức năng: phạm vi tác động gồm đối nội, đối ngoại; lĩnh vực gồm chính trị, kinh tế, văn hóa, xã hội; tính chất quyền lực gồm tổ chức xây dựng và trấn áp theo giáo trình.",
    "hints": [
      "Có những cách phân chia theo phạm vi, theo lĩnh vực và theo tính chất.",
      "Đối nội/đối ngoại thuộc tiêu chí phạm vi tác động."
    ],
    "explanation": "Giáo trình phân chia chức năng Nhà nước XHCN theo nhiều tiêu chí. Mỗi cách phân chia trả lời một câu hỏi khác nhau: hoạt động trong hay ngoài nước, lĩnh vực nào, hoặc tính chất của việc thực hiện quyền lực. Không nên xem những nhóm phân loại này là các chức năng hoàn toàn tách biệt. Trước khi ghép, hãy xác định tiêu chí phân loại mà thẻ đang sử dụng. Đối nội và đối ngoại trả lời câu hỏi về phạm vi, còn chính trị hay kinh tế chỉ lĩnh vực. Tổ chức xây dựng và trấn áp thuộc cách phân chia theo tính chất quyền lực được nêu trong sách. Vì khác tiêu chí, các nhóm này có thể cùng mô tả một hoạt động từ nhiều góc nhìn và không nên được coi là những ngăn hoàn toàn riêng biệt.",
    "keyTakeaways": [
      "Chức năng Nhà nước được phân chia theo phạm vi tác động, lĩnh vực và tính chất quyền lực.",
      "Các nhóm dựa trên những tiêu chí khác nhau nên không phải những chức năng hoàn toàn tách biệt."
    ],
    "source": {
      "book": "Giáo trình Chủ nghĩa xã hội khoa học (2021)",
      "chapter": 4,
      "printedPages": [
        144,
        145
      ],
      "pdfPages": [
        141,
        142
      ],
      "sourceReviewStatus": "needs-review"
    },
    "clueReward": {
      "id": "clue-r4-3",
      "name": "Hồ sơ: Chức năng nhà nước",
      "description": "Tủ hồ sơ có ba tiêu chí phân chia chức năng: phạm vi tác động gồm đối nội, đối ngoại; lĩnh vực gồm chính trị, kinh tế, văn hóa, xã hội; tính chất quyền lực gồm tổ chức xây dựng và trấn áp theo giáo trình."
    },
    "pairs": [
      {
        "id": "r4-p3-pair-1",
        "left": "Theo phạm vi tác động: đối nội",
        "right": "Chức năng liên quan tổ chức, quản lý công việc trong nước"
      },
      {
        "id": "r4-p3-pair-2",
        "left": "Theo phạm vi tác động: đối ngoại",
        "right": "Chức năng trong các quan hệ, hoạt động đối ngoại"
      },
      {
        "id": "r4-p3-pair-3",
        "left": "Theo lĩnh vực",
        "right": "Các chức năng chính trị, kinh tế, văn hóa, xã hội"
      },
      {
        "id": "r4-p3-pair-4",
        "left": "Theo tính chất quyền lực",
        "right": "Chức năng tổ chức xây dựng và chức năng trấn áp theo cách trình bày của giáo trình"
      }
    ]
  },
  {
    "id": "r4-p4",
    "roomId": 4,
    "order": 4,
    "type": "evidence-lock",
    "title": "Khóa nền tảng dân chủ",
    "hotspotName": "Cửa hội trường",
    "learningObjective": "xác định những nhận định phù hợp về quan hệ giữa dân chủ XHCN và Nhà nước XHCN.",
    "instruction": "Đọc ba manh mối và tài liệu tại khóa. Chỉ kích hoạt các bản ghi được nguồn hỗ trợ.",
    "readingNote": "Văn bản cuối phòng bổ sung: dân chủ XHCN là cơ sở, nền tảng cho xây dựng và hoạt động của Nhà nước XHCN; Nhà nước là công cụ quan trọng thực hiện quyền làm chủ. Quyền cần được thể chế hóa và bảo đảm thực thi. Dân chủ trực tiếp và gián tiếp là hai hình thức thực hiện.",
    "hints": [
      "Đọc lại bản đồ chức năng nhà nước và manh mối về hình thức dân chủ.",
      "Giáo trình trình bày mối quan hệ hỗ trợ qua lại giữa dân chủ và nhà nước."
    ],
    "explanation": "Chương 4 nêu dân chủ XHCN là nền tảng cho việc xây dựng, hoạt động của Nhà nước XHCN; đồng thời nhà nước giữ vai trò tổ chức, thể chế hóa và thực thi quyền làm chủ của nhân dân. Hai hình thức dân chủ trực tiếp/gián tiếp không loại trừ nhau chỉ vì tồn tại thiết chế đại diện. Quan hệ được trình bày ở đây bao gồm nền tảng của hoạt động nhà nước và phương thức bảo đảm quyền làm chủ được thực hiện. Một tuyên bố về quyền cần gắn với cơ chế và việc thực thi, chứ không chỉ tồn tại ở cách diễn đạt. Đồng thời, có thiết chế đại diện không cho phép phủ nhận mọi hình thức tham gia trực tiếp. Khi chọn chứng cứ, hãy kết hợp tài liệu quan hệ dân chủ – nhà nước với các manh mối đã nhận.",
    "keyTakeaways": [
      "Dân chủ XHCN là cơ sở, nền tảng cho xây dựng và hoạt động của Nhà nước XHCN.",
      "Nhà nước giữ vai trò thể chế hóa, bảo đảm và thực thi quyền làm chủ của nhân dân."
    ],
    "source": {
      "book": "Giáo trình Chủ nghĩa xã hội khoa học (2021)",
      "chapter": 4,
      "printedPages": [
        147,
        148,
        153
      ],
      "pdfPages": [
        144,
        145,
        150
      ],
      "sourceReviewStatus": "needs-review"
    },
    "statements": [
      {
        "id": "r4p4-t1",
        "text": "Dân chủ XHCN được giáo trình trình bày như cơ sở, nền tảng của việc xây dựng và hoạt động Nhà nước XHCN.",
        "supported": true
      },
      {
        "id": "r4p4-t2",
        "text": "Nhà nước XHCN được trình bày như công cụ quan trọng để thực hiện quyền làm chủ của nhân dân.",
        "supported": true
      },
      {
        "id": "r4p4-t3",
        "text": "Thực hiện dân chủ cần gắn với việc thể chế hóa, bảo đảm và thực thi quyền trong thực tế.",
        "supported": true
      },
      {
        "id": "r4p4-f1",
        "text": "Chỉ cần nói tới dân chủ là không còn cần thiết chế hay cơ chế thực hiện.",
        "supported": false
      },
      {
        "id": "r4p4-f2",
        "text": "Có cơ quan đại diện nghĩa là người dân không có hình thức tham gia trực tiếp nào.",
        "supported": false
      }
    ]
  }
] satisfies Puzzle[];
