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
    return PAGE.includes("pingyou_shenbao") || !!document.forms.gerenshenbao || !!document.forms.jitishenbao;
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
