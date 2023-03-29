-- Post System Database-- 
-- Create database separetly for Post System
CREATE DATABASE  IF NOT EXISTS `post_system` ;
USE `post_system`;

-- change max allowed  for load big files
SET GLOBAL max_allowed_packet=67108864;

-- ----------------------
-- Table _1 action_type --
-- الاجراءات [Action_Type_ID,Action_Type_Name ] = > [الاجراء , ورقم تعريفى للاجراء] --

CREATE TABLE `action_type` (
  `Action_Type_ID` int NOT NULL AUTO_INCREMENT,
  `Action_Type_Name` varchar(50) NOT NULL,
  PRIMARY KEY (`Action_Type_ID`)
) ;

-- insert Data for table action_type  --
 INSERT INTO `post_system`.`action_type`
(`Action_Type_ID`,
`Action_Type_Name`)
VALUES (1,'للاعــتـمـــــــــــاد'),(2,'لإتخـــــــــاذ إجــــــــــــراء'),(3,'لمراجـــعـــــتـى'),(4,'لإبــــــــــداء الـــــــــرأى')
		,(5,'للتــنـــــــســيـــق'),(6,'لإبــــــــــــــلاغ من يــلـــزم'),(7,'للإفــــــــــــــــــادة'),(8,'للـدراســــــــــــــــــة')
        ,(9,'للإيـــــجـــــــــــــاز'),(10,'للتـــعــمــيـــــــم'),(11,'للاطــــــــلاع والحـفـــــــظ'),(12,'للاطــــــــــلاع والمتـابعـة')
        ,(13,'للاطـــــــــلاع والاتــــــــــــلاف');

-- Table _2 departments جدول الاقسام --
-- depart_id رمز القسم - department سم القسم - depart_parent_id للترتيب الاستراتيجى للاقسام  - 
-- for_drop_box  رقم 1 للاقسام اللى ينقع المدير يوزعلها
CREATE TABLE `departments` (
  `depart_id` int NOT NULL,
  `department` varchar(45) NOT NULL,
  `depart_parent_id` int DEFAULT NULL,
  `for_drop_box` int DEFAULT '0',
  PRIMARY KEY (`depart_id`)
);

-- insert Data for table departments --
INSERT INTO `post_system`.`departments`
(`depart_id`,
`department`,
`depart_parent_id`,
`for_drop_box`)
VALUES (1,'المدير',NULL,0),(2,'المتابعه',1,0),(3,'مساعد المدير',2,1),(4,'مدير قسم الاتصالات الادارية',3,1)
	    ,(5,'مدير التموين',3,1),(6,'مدير النقل',3,1),(7,'ضابط قسم الامن',3,1),(8,'مدير قسم متابعة العقود',3,1)
        ,(9,'مكتب متابعة العقود',8,0),(10,'مكتب الاستلام والترحيل',8,0),(11,'مكتب المشتريات',8,0),(12,'قسم المستودعات',5,0)
        ,(13,'مراقبة المخزون',5,0),(14,'التشغيل والصيانة',5,0),(15,'الإعاشة',5,0),(16,'قسم النقل',6,0)
        ,(17,'فسم الصيانة',6,0),(18,'البريد الطواف',6,0),(19,'عربات الضيوف',6,0),(20,'مكتب المخدرات',4,0)
        ,(21,'مكتب التدريب',4,0),(22,'الاتصالات الإدارية',4,0),(23,'مكتب الحاسب الالى',4,0),(24,'مكتب شئون الموظفين',4,0)
        ,(25,'مكتب العلاقات العامة',4,0),(26,'الارشيف',1,0);

-- Table _3 priority  زى فورى عاجل عاجل جدا وهكذا  --
CREATE TABLE `priority` (
  `prority_id` int NOT NULL,
  `prority_desc` varchar(30) NOT NULL,
  PRIMARY KEY (`prority_id`)
);

-- insert Data for table priority --
INSERT INTO `post_system`.`priority`
(`prority_id`,
`prority_desc`)
VALUES (1,'بدون'),(2,'عاجل'),(3,'عاجل جدا'),(4,'فورى');

-- Table _4 secrets_degree  لدرجة السرية --
CREATE TABLE `secrets_degree` (
  `degree_id` int NOT NULL,
  `degree_desc` varchar(45) NOT NULL,
  PRIMARY KEY (`degree_id`)
);
-- insert Data for table secrets_degree --
INSERT INTO `post_system`.`secrets_degree`
(`degree_id`,
`degree_desc`)
VALUES (1,'بدون'),(2,'سرى'),(3,'سرى للغاية');

-- Table _5 users --
-- كل مستخدم ليه 
-- [user_id كود المستخدم, user_name اسم المستخدم, pass كلمة مرور, user_temp_id الستخدم الموكل له بالإنابة]--
CREATE TABLE `users` (
  `user_id` varchar(10) NOT NULL,
  `user_name` text ,
  `pass` varchar(50) NOT NULL DEFAULT '123',
  `user_temp_id` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
);

-- users data --
INSERT INTO `post_system`.`users`
(`user_id`,
`user_name`,
`pass`)
VALUES ('LSE505','سامي بن ناصر المالكي','123'),('LSE510','شجاع بن عبدالله البقمي','123'),('LSE511','ماجد بن مسعود السلمي','123'),('LSE514','صالح بن سعيد الغامدي','123')
		,('LSE515','هيثم بن محمد الجهني','123'),('LSE518','بدر بن غزاي العتيبي','123'),('LSE520','بندر بن عبدالهادي البيشي','123'),('LSE521','عبدالله بن عبده المباركي','123')
		,('LSE522','حسن بن احمد أبو راسين','123'),('LSE528','ماجد بن سعد العتيبي','123'),('LSE529','عبدالله بن علي حدادي','123'),('LSE530','أسامة بن احمد مكين','123')
		,('LSE531','صالح بن عابد العتيبي','123'),('LSE532','ساعد بن منصور الحصيني','123'),('LSE534','راكان بن حميد الصاعدي','123'),('LSE547','محمد بن عبدالعالي السلمي','123')
		,('LSE551','تركي بن مقيت الحربي','123'),('LSO502','اللواء الركن/ محمد بن مناع العمري','123'),('LSO505','العقيد الركن/ حسن بن فهيد العصيمي','123'),('LSO506','وجدي بن إبراهيم الحربي','123')
		,('LSO507','العقيد عبدالله بن غيثان العمري','123'),('LSO511','العقيد/ إبراهيم بن علي القرني','123'),('LSO513','المقدم الركن/ تركي بن شباب المطيري','123'),('LSO517','العقيد/ ناصر بن سلطان السبيعي','123')
		,('LSO518','النقيب/ سطام بن مسعود الصبحي','123'),('LSO519','الملازم/ زيد بن إبراهيم القريان','123'),('LSO533','العقيد الركن/ غبدالله بن سعيد القحطاني','123'),('LSO537','المقدم / مشعل بن غشام الموكاء','123')
		,('LSO555','العميد الركن / عماد بن هديبان السهلي','123'),('LSX500','محمد بن ترسن خوجة','123'),('LSX503','ياسر بن سعود المجنوني','123'),('LSX508','مهند بن محمد السليمان','123')
		,('LSX510','منصور بن محمد الشعيبي','123'),('LSX511','بلقاسم بن عبدالله الشريف','123'),('LSX513','صالح بن يسلم بن محفوظ','123'),('LSX514','حماد بن صالح الحماد','123')
		,('LSX516','عبدالله بن سعيد كشم','123'),('LSX520','هشام بن احمد غبار','123'),('LSX521','بدر بن عبد الله المشيقح','123'),('LSX523','حسن بن محمد البيشي','123')
		,('LSX524','سليمان بن عبدالله الضبيعي','123'),('LSX525','عبدالله بن علي الحربي','123'),('LSX526','سليمان بن صالح الرفقي','123'),('LSX542','فهد بن خير الله سعيد','123')
		,('LSX544','محمدبن عبدالرحمن اليحيى','123'),('LSX545','محمد بن عبدالله القثامي','123'),('LSX546','عبدالله بن سعد العصيمي','123'),('LSX547','بندر بن محمد حماص','123');
-- Table _6  department users مستخدمى الاقسام --
-- [department_ID كود القسم, user_id مستخدم القسم, role مستوى صلاحياته]--
CREATE TABLE `department_users` (
  `department_ID` int NOT NULL,
  `user_id` varchar(15) NOT NULL,
  `role` int NOT NULL,
  UNIQUE KEY `user_id_UNIQUE` (`user_id`)
);

-- department users data --
INSERT INTO `post_system`.`department_users`
(`department_ID`,
`user_id`,
`role`)
VALUES  (26,'LSE505',3),
    (7,'LSE510',0),
    (4,'LSE511',0),
    (2,'LSE514',2),
    (4,'LSE515',0),
    (5,'LSE518',0),
    (5,'LSE520',0),
    (26,'LSE521',3),
    (5,'LSE522',0),
    (5,'LSE528',0),
    (4,'LSE529',0),
    (5,'LSE530',0),
    (6,'LSE531',0),
    (5,'LSE532',0),
    (7,'LSE534',0),
    (2,'LSE547',2),
    (5,'LSE551',0),
    (1,'LSO502',1),
    (5,'LSO505',0),
    (4,'LSO506',0),
    (5,'LSO507',0),
    (5,'LSO511',2),
    (4,'LSO513',2),
    (6,'LSO517',2),
    (7,'LSO518',2),
    (9,'LSO519',0),
    (8,'LSO533',2),
    (4,'LSO537',0),
    (3,'LSO555',2),
    (9,'LSX500',0),
    (9,'LSX503',0),
    (4,'LSX508',0),
    (9,'LSX510',0),
    (4,'LSX511',0),
    (9,'LSX513',0),
    (9,'LSX514',0),
    (4,'LSX516',0),
    (5,'LSX520',0),
    (9,'LSX521',0),
    (5,'LSX523',0),
    (5,'LSX524',0),
    (2,'LSX525',0),
    (9,'LSX526',0),
    (9,'LSX542',0),
    (4,'LSX544',0),
    (4,'LSX545',0),
    (4,'LSX546',0),
    (4,'LSX547',0);

        
-- Table _7  income تسجيل الوارد --
-- [Income_ID كود الوارد, Income_No رقم الوارد, Income_Subject موضوع الخطاب, Income_Date تاريخ تسجيل الوارد, degree_Of_Security درجة السرية, degree_Of_Priority درجة الاولوية, from_depart الجهة المرسلة, from_user_id المستخدم الذى سجل الوارد] --
CREATE TABLE `income` (
  `Income_ID` int NOT NULL AUTO_INCREMENT,
  `Income_No` varchar(50) NOT NULL,
  `Income_Subject` text NOT NULL,
  `Income_Date` datetime NOT NULL,
  `degree_Of_Security` int NOT NULL,
  `degree_Of_Priority` int NOT NULL,
  `from_depart` text NOT NULL,
  `from_user_id` varchar(10) NOT NULL,
  PRIMARY KEY (`Income_ID`)
);
-- Table _8 income document ملفات الوارد --
-- [Income_ID كود الوارد, Income_Document ملف الخطاب] --
CREATE TABLE `income_document` (
  `Income_ID` int NOT NULL,
  `Income_Document` longblob NOT NULL,
  PRIMARY KEY (`Income_ID`)
);

-- Table _9 manager assigned توزيع الوارد --
-- [Income_ID كود الوارد, Assignment_Date تاريخ التوزيع, Assigned_From القسم الموزع, Assigned_To القسم الموزع له, Action_Type نوع الاجراء, Action_text الإجراء المتخذ, manager_assigned_text إضافة توجيه] --
CREATE TABLE `manager_assigned` (
  `Income_ID` int NOT NULL,
  `Assignment_Date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Assigned_From` int NOT NULL,
  `Assigned_To` int NOT NULL,
  `Action_Type` int NOT NULL,
  `Action_text` text,
  `manager_assigned_text` longtext,
  PRIMARY KEY (`Income_ID`,`Assigned_From`,`Assigned_To`)
);

--  Table _10 outcome تسجيل الصادر --
-- [Outcome_ID كود الصادر, Outcome_No رقم الصادر, Outcome_Subject موضوع الخطاب, Outcome_Date تاريخ تسجيل الصادر, degree_Of_Security درجة السرية, degree_Of_Priority درجة الاولوية] --
CREATE TABLE `outcome` (
  `Outcome_ID` int NOT NULL AUTO_INCREMENT,
  `Outcome_No` varchar(50) NOT NULL,
  `Outcome_Subject` varchar(50) NOT NULL,
  `Outcome_Date` datetime NOT NULL,
  `degree_Of_Security` int NOT NULL,
  `degree_Of_Priority` int NOT NULL,
  PRIMARY KEY (`Outcome_ID`)
);

-- view manager assigned income لعرض الوارد و مسار توزيعه  --
CREATE  VIEW `manager_assigned_income` AS
 select `income`.`Income_ID` AS `Income_ID`,`income`.`Income_No` AS `Income_No`,`income`.`Income_Subject` AS `Income_Subject`
	,`income`.`Income_Date` AS `Income_Date`,`income`.`from_depart` AS `register_department_id`,`income`.`from_user_id` AS `register_user_id`
	,`users`.`user_name` AS `register_user`,`income`.`degree_Of_Security` AS `degree_Of_Security`,`secrets_degree`.`degree_desc` AS `security_degree`
	,`income`.`degree_Of_Priority` AS `degree_Of_Priority`,`priority`.`prority_desc` AS `priority_degree`,`manager_assigned`.`Assigned_From` AS `Assigned_From`
	,`departments`.`department` AS `department_from`,`manager_assigned`.`Assigned_To` AS `Assigned_To`,`departments1`.`department` AS `department_to`
	,`manager_assigned`.`Assignment_Date` AS `Assignment_Date`,`manager_assigned`.`Action_Type` AS `action_type_id`,`manager_assigned`.`Action_text` AS `Action_text`
	,`action_type`.`Action_Type_Name` AS `action_type`,`manager_assigned`.`manager_assigned_text` AS `manager_assigned_text`,
	`post_system`.`manager_assigned`.`notification_read` AS `notification_read` 
 from (((((((`income` join `manager_assigned` on((`manager_assigned`.`Income_ID` = `income`.`Income_ID`))) left join `departments` on((`departments`.`depart_id` = `manager_assigned`.`Assigned_From`)))
	left join `departments` `departments1` on((`departments1`.`depart_id` = `manager_assigned`.`Assigned_To`))) join `secrets_degree` on((`secrets_degree`.`degree_id` = `income`.`degree_Of_Security`))) 
	join `priority` on((`priority`.`prority_id` = `income`.`degree_Of_Priority`))) left join `action_type` on((`action_type`.`Action_Type_ID` = `manager_assigned`.`Action_Type`))) 
	join `users` on((`users`.`user_id` = `income`.`from_user_id`)))
 group by `income`.`Income_ID`,`income`.`Income_No`,`income`.`Income_Subject`,`income`.`Income_Date`,`income`.`from_depart`,
	`income`.`from_user_id`,`users`.`user_name`,`income`.`degree_Of_Security`,`secrets_degree`.`degree_desc`,`income`.`degree_Of_Priority`,
	`priority`.`prority_desc`,`manager_assigned`.`Assigned_From`,`departments`.`department`,`manager_assigned`.`Assigned_To`,`departments1`.`department`
	,`manager_assigned`.`Assignment_Date`,`manager_assigned`.`Action_Type`,`action_type`.`Action_Type_Name`;
    
-- view department users  لعرض الاقسام و المستخدمين و المستخدمين الموكل لهم بالإنابة--
CREATE VIEW `V_department_users` AS 
select `users`.`user_id` AS `user_id`,`users`.`user_temp_id` AS `user_temp_id`,`users`.`user_name` AS `user_name`,`departments`.`depart_id` AS `depart_id`
	,`departments`.`depart_parent_id` AS `depart_parent_id`,`departments`.`department` AS `department`,`department_users`.`role` AS `role`
 from ((`users` join `department_users` on((`department_users`.`user_id` = `users`.`user_id`))) 
	join `departments` on((`departments`.`depart_id` = `department_users`.`department_ID`)));    

ALTER TABLE `post_system`.`manager_assigned` 
ADD COLUMN `notification_read` TINYINT NULL DEFAULT 0 AFTER `read_notification`;
    
