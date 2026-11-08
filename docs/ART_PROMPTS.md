# Bộ prompt hình ảnh — Hội đồng phục dựng

Các tài nguyên được sinh bằng công cụ tạo ảnh tích hợp, sau đó xuất WebP vào `public/art`. Bảng mẫu đầu tiên là ảnh tham chiếu phong cách/nhân vật cho các lần sinh tiếp. Mọi yêu cầu đều cấm typography, logo, watermark và giao diện gắn sẵn trong ảnh.

## Bảng mẫu / hero

Create a polished game art reference board for HOI DONG PHUC DUNG, an original Vietnamese mystery investigation game set in a future archive in 2126. One landscape illustration, no text. Dark navy antique library arches with restrained brass holographic equipment and a glowing teal miniature city laboratory in the upper half. Lower half show FOUR DISTINCT Vietnamese adult investigators waist-up side by side, all fully visible: An, a calm woman with dark bob hair, round spectacles, long navy archivist coat with brass gold trim and a notebook; Minh, a practical man with short hair, indigo technician jacket blue trim and gloves; Vy, a curious woman with short tied-back hair, terracotta red scarf, cross-body satchel, recorder; Khoi, a composed man with swept hair, structured deep purple coat and clipboard. Clear expressive faces, stylish European graphic novel ink outlines, painterly cel shaded 2D backgrounds, sophisticated mystery comic, warm parchment light against navy shadows, no anime, no photorealism, no pixel art, no logos, no typography, not a UI screenshot. This will be the style and character identity reference for all subsequent game assets.

## Nền phòng, hội đồng và lõi

Hai mẫu chỉ dẫn phong cách được dùng:

1. Reference is STYLE ONLY. Generate a new finished background asset for the same mystery graphic novel game, matching its hand-inked 2D painterly cel shading, navy and brass palette and old-world futuristic archive architecture. [SCENE] Landscape aspect 16:9. No interface, no lettering, no borders, no watermark. Restrained detail and luminous focal points, sophisticated comic not realistic 3D.
2. Use reference as STYLE ONLY. New finished 2D game background for the same mysterious graphic novel. Hand-inked crisp outlines, painterly cel shading, navy antique library and restrained future technology. [SCENE] Wide 16:9 composition, no people, no text or UI, no letters, no labels, no panels, no watermark, not realistic 3D.

Các SCENE:

- **room-1, mẫu 1:** An EMPTY origin archive in an antique future library. Left tall bookcases and brass drawer cabinet, center walnut reading desk with open manuscript under a lamp, right antique astronomical clock and portrait dossier cabinet. A faint gold holographic projector in back. Wide 16:9 environmental game background with clear large silhouettes for six hotspots. No people, no text.
- **room-2, mẫu 2:** An EMPTY archival factory, old brass industrial machines blended with gothic library architecture. Left: blue screen labor dossier console; middle: idle conveyor and three branching machine circuits; right: two stacked glass panels with file drawers, a small handover desk. Cobalt blue glows, deep navy and brass. Clear large silhouettes for six interactive objects.
- **room-3, mẫu 1:** An EMPTY investigative laboratory in an antique future library. Center: large round table with a dark miniature city model and a restrained teal hologram. Left: archive terminal and brass framed blueprint. Right: two branching conduits and glass specimen cabinet. Readable large furniture silhouettes at left middle right for six hotspots. No people. Wide 16:9 environmental game background, full scene not panels.
- **room-4, mẫu 2:** An EMPTY ancient future assembly hall. Violet light from arched windows, curved rows of walnut representative seats, center podium and large luminous violet process diagram without text, left brass framed abstract concept panels, right filing cabinet and a purple glass console. Clear large silhouettes for six interactive objects.
- **council, mẫu 1:** An EMPTY deliberation chamber in an antique future library. Large round walnut council table centered, four empty seats around it, parchment folders and small brass hologram on the table. Monumental gothic shelves and arched windows, warm gold evening light, mysterious deep navy shadows. Wide 16:9 environmental game background. No people, no text.
- **core, mẫu 2:** An EMPTY central archive core, a monumental circular library vault with four suspended brass framed luminous books connected by restrained gold light paths to a central glass memory column. Warm restored library beyond a great archway, navy shadows and gold teal blue violet glows. A low walnut examination table in foreground. Cinematic hopeful mystery finale.

## Bốn atlas biểu cảm

Produce ONE production portrait-expression sprite sheet asset for a 2D mystery graphic novel game. Preserve exactly this reference character's identity, age, face, hair and costume: [PERSON]. Sheet uses an EXACT regular 3-column by 2-row grid across the entire landscape 3:2 canvas, every cell identical square size. FIVE head-and-upper-chest portraits of the SAME character, centered at identical scale, head completely visible with 8% padding, waist cropped at cell bottom. Cell order: top left NEUTRAL, top center THINKING, top right DOUBTFUL, bottom left WARM AGREEMENT, bottom center SURPRISED; bottom right completely empty transparent. Pose subtle, facial expression distinct. Hand-inked clean graphic novel outlines and painterly cel shading matching reference. NO text, NO labels, NO borders or dividers, NO props outside cell. Genuinely TRANSPARENT BACKGROUND, no colored squares, no scenery. Consistent head placement in each cell for CSS sprite animation.

- **an:** FIRST character in reference: calm Vietnamese woman, dark bob haircut, round spectacles, long navy archivist coat with gold embroidery, cream mandarin collar, notebook.
- **minh:** SECOND character: Vietnamese man, short black textured hair, navy technician jacket with blue edging, practical gloves.
- **vy:** THIRD character: Vietnamese woman, dark tied-back hair with loose fringe, terracotta red scarf, cream shirt, crossbody satchel strap.
- **khoi:** FOURTH character: Vietnamese man, swept dark hair, structured dark plum coat with purple trim, cream shirt, clipboard.

## Bốn atlas chứng cứ

ONE evidence icon atlas asset for the same antique future library 2D mystery graphic novel. Exact regular 4 columns by 2 rows grid, each cell same size. Seven different centered close-up still-life object illustrations on uniform dark navy backgrounds. Top row left to right and bottom row left to right, in order: [OBJECTS]. Eighth bottom-right cell empty navy. Objects fully inside each cell, 15% padding, no object crossing cells. Match hand inked brass and navy painterly cel-shaded style of reference, beautiful readable silhouettes, NO lettering, numbers, text, titles, borders, UI, watermark. Each object will appear as a separate evidence card illustration.

- **evidence-1:** an open manuscript about origins, a brass projector log scroll, a portrait dossier, an astronomical clock chart, a brass provenance stamp, a torn annotated parchment, a sealed personal letter.
- **evidence-2:** two overlapping worker dossier lenses, a blue diagnostic terminal, a three-way brass circuit, two interlocking condition gears, a futuristic industrial labor dossier, an annotated inspection file, a sealed personal letter.
- **evidence-3:** a miniature city blueprint, a teal diagnostic terminal with broken connection, two branching brass routes, four layered glass panels, a glass archive of scientific instruments, a torn annotation reunited with a page, a sealed personal letter.
- **evidence-4:** three abstract concept panels, a brass recording device, a representative chair and a voting card, a branching function diagram, a parchment linked to a brass mechanism, two intertwined participation paths, a sealed personal letter.
