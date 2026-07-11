// AI更易办 - 拆分自旧版 content.js。
  function isAttendancePage() {
    const bodyText = text(document.body);
    return PAGE.includes("kaoqin") || bodyText.includes("到课数据") || (bodyText.includes("节次") && bodyText.includes("时间段") && bodyText.includes("周一"));
  }

  function isAttendancePublicPage() {
    const bodyText = text(document.body);
    return PAGE.includes("kaoqin_liulan") || bodyText.includes("考勤累计数据公示");
  }

  function isLeavePage() {
    const bodyText = text(document.body);
    return PAGE.includes("queke") || (bodyText.includes("缺课") && bodyText.includes("请假"));
  }

  function isSchoolLeavePage() {
    return PAGE.includes("lixiao_beian") || !!document.forms.lixiaobeian || !!document.querySelector('form[action*="stuser_lixiao_beian"]');
  }

  function isIdeologyScorePage() {
    return PAGE.includes("jiangcheng_chaxunjifen") || !!document.querySelector('a[href*="wbnewsid=8541"]');
  }

  function isAnnualAwardPage() {
    return PAGE.includes("pingyou_shenbaolist") || !!document.forms.gerenshenbao || !!document.forms.jitishenbao;
  }

  function isAwardDeclarationPage() {
    return PAGE.includes("pingyou_shenbao_geren") || PAGE.includes("pingyou_shenbao_jiti") || !!document.forms.niandupingyoushenbao;
  }

  function isDashboardPage() {
    const bodyText = text(document.body);
    return PAGE.includes("whatcanido") || (bodyText.includes("大学期间常用重要联系方式") && bodyText.includes("辅导员"));
  }

  function isTrainingPlanPage() {
    return PAGE.includes("peiyangfangan") || text(document.body).includes("本科阶段需修习的课程及学分");
  }

  function isLectureReportPage() {
    const bodyText = text(document.body);
    return PAGE.includes("tingbaogao") || (bodyText.includes("听报告") && bodyText.includes("学术讲座"));
  }

  function isRoleHistoryPage() {
    return PAGE.includes("renzhi") || text(document.body).includes("任职经历");
  }

  function isCareerTestPage() {
    return PAGE.includes("zhiyeqingxiang") || text(document.body).includes("霍兰德职业倾向");
  }

  function isAnnouncementPage() {
    return PAGE.includes("gonggao_qianyue") || text(document.body).includes("签阅必读公告");
  }

  function isFaceToFacePage() {
    return PAGE.includes("mianqianxiaojia") || text(document.body).includes("面签");
  }

  function isHolidayDestinationPage() {
    return PAGE.includes("liuxiao_dengji") || text(document.body).includes("假期去哪儿");
  }

  function isZhitongchePage() {
    const bodyText = text(document.body);
    return (
      PAGE.includes("stuser_zhitongche") ||
      !!document.querySelector('form[action*="stuser_zhitongche_save"]') ||
      (bodyText.includes("珞珈智通车") && bodyText.includes("正在提交的智通车内容"))
    );
  }

  function isGradePage() {
    return PAGE.includes("chengji_chaxun") || !!document.querySelector('form[action*="chengji_chaxun_toexcel"]');
  }

  function isClothingSizePage() {
    const bodyText = text(document.body);
    return PAGE.includes("fuzhuang_tianbao") || bodyText.includes("服装") || bodyText.includes("尺码");
  }

  function isPartyProgressPage() {
    return PAGE.includes("rudang_chaxun") || !!document.querySelector('a[href*="wbnewsid=9011"], a[href*="wbnewsid=8981"]');
  }

  function isGuidePage() {
    const bodyText = text(document.body);
    return PAGE.includes("%e4%bd%bf%e7%94%a8%e6%8c%87%e5%8d%97") || (bodyText.includes("使用指南") && bodyText.includes("访问路径") && bodyText.includes("功能概览"));
  }

  function isLoginPage() {
    return !!document.querySelector("form#loginform, form[name='loginform']") || (document.querySelector('input[type="password"]') && text(document.body).includes("登录"));
  }
