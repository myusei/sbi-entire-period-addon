// SBI証券 配当金・分配金履歴ページ用 拡張スクリプト
(function() {
  // 「今年」ボタンを探す
  function findThisYearButton() {
    // 「今年」ラベルのlabel要素を探す
    const labels = document.querySelectorAll('label.input-button-primary.rounded-sm.css-1wifdzn');
    for (const label of labels) {
      const p = label.querySelector('p');
      if (p && p.textContent.trim() === '今年') {
        return label;
      }
    }
    return null;
  }

  // 「直近1年」ボタンを作成
  function createOneYearButton() {
    const label = document.createElement('label');
    label.className = 'input-button-primary rounded-sm css-1wifdzn';
    label.style.cursor = 'pointer';
    label.innerHTML = `
      <input type="checkbox" id="one_year" value="ONE_YEAR">
      <p class="text py-x-1 px-0 font-xs rounded-sm">直近1年</p>
    `;
    return label;
  }

  // 「全期間」ボタンを作成
  function createAllPeriodButton() {
    const label = document.createElement('label');
    label.className = 'input-button-primary rounded-sm css-1wifdzn';
    label.style.cursor = 'pointer';
    label.innerHTML = `
      <input type="checkbox" id="all_period" value="ALL_PERIOD">
      <p class="text py-x-1 px-0 font-xs rounded-sm">全期間</p>
    `;
    return label;
  }

  // 日付を計算する関数: 終了日から1年前の日付を計算
  function calculateOneYearBefore(endDateStr) {
    try {
      const parts = endDateStr.split('/');
      if (parts.length !== 3) return null;
      
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      
      // 1年前の年を計算
      const oneYearBefore = new Date(year - 1, month - 1, day + 1);
      
      // フォーマット: YYYY/MM/DD
      const formattedYear = oneYearBefore.getFullYear();
      const formattedMonth = String(oneYearBefore.getMonth() + 1).padStart(2, '0');
      const formattedDay = String(oneYearBefore.getDate()).padStart(2, '0');
      
      return `${formattedYear}/${formattedMonth}/${formattedDay}`;
    } catch (error) {
      console.error('Error calculating one year before date:', error);
      return null;
    }
  }

  // 「直近1年」ボタンのクリック時処理
  function onOneYearClick(e) {
    // 終了日の入力フィールドを探す
    const endDateInputs = document.querySelectorAll('input[type="text"].pr-x-3.input-sm');
    let endDateInput = null;
    let startDateInput = null;
    
    // 通常、最初が開始日、次が終了日
    if (endDateInputs.length >= 2) {
      startDateInput = endDateInputs[0];
      endDateInput = endDateInputs[1];
    } else if (endDateInputs.length === 1) {
      // 1つしかない場合は終了日と仮定
      endDateInput = endDateInputs[0];
      startDateInput = endDateInputs[0]; // 同じ要素を開始日として使用
    }
    
    if (endDateInput && endDateInput.value) {
      const oneYearBeforeDate = calculateOneYearBefore(endDateInput.value);
      if (oneYearBeforeDate && startDateInput) {
        console.log(`Setting start date to ${oneYearBeforeDate} (1 year before ${endDateInput.value})`);
        startDateInput.value = oneYearBeforeDate;
        startDateInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        // URLを作成してリダイレクト
        constructAndRedirectURL(startDateInput.value, endDateInput.value);
      }
    }
    
    // 他のチェックボックスを外す
    document.querySelectorAll('label.input-button-primary.rounded-sm.css-1wifdzn input[type="checkbox"]').forEach(cb => {
      if (cb.id !== 'one_year') cb.checked = false;
    });
    // 自分をON
    e.target.checked = true;
  }

  // 現在のページタイプを判定する関数
  function getPageType() {
    const currentURL = window.location.href;
    if (currentURL.includes('/account/assets/profits')) {
      return 'profits';
    } else if (currentURL.includes('/account/assets/dividends')) {
      return 'dividends';
    }
    return null;
  }

  // URLを作成してリダイレクトする関数
  function constructAndRedirectURL(startDate, endDate) {
    try {
      // 日付のフォーマットを確認（YYYY/MM/DD形式）
      const startDateFormatted = startDate;
      const endDateFormatted = endDate;
      
      const pageType = getPageType();
      let url;
      
      if (pageType === 'profits') {
        // 損益計算ページ用のURL
        url = `https://site.sbisec.co.jp/account/assets/profits?baseDateType=CONTRACT&baseDateFrom=${encodeURIComponent(startDateFormatted)}&baseDateTo=${encodeURIComponent(endDateFormatted)}&product=ALL`;
      } else {
        // 配当金・分配金履歴ページ用のURL（デフォルト）
        url = `https://site.sbisec.co.jp/account/assets/dividends?dispositionDateFrom=${encodeURIComponent(startDateFormatted)}&dispositionDateTo=${encodeURIComponent(endDateFormatted)}`;
      }
      
      console.log(`Redirecting to: ${url}`);
      
      // リダイレクト
      window.location.href = url;
    } catch (error) {
      console.error('Error constructing or redirecting URL:', error);
    }
  }

  // 「全期間」ボタンのクリック時処理
  function onAllPeriodClick(e) {
    // 最初に見つかるinput[type="text"].pr-x-3.input-smを取得（開始日の入力フィールド）
    const startDateInput = document.querySelector('input[type="text"].pr-x-3.input-sm');
    let endDateInput = null;
    
    // 終了日の入力フィールドを探す
    const endDateInputs = document.querySelectorAll('input[type="text"].pr-x-3.input-sm');
    if (endDateInputs.length >= 2) {
      endDateInput = endDateInputs[1];
    } else if (endDateInputs.length === 1) {
      endDateInput = endDateInputs[0];
    }
    
    if (startDateInput) {
      console.log('Setting start date to 2021/08/01 for All Period');
      startDateInput.value = '2021/08/01';
      startDateInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      // 終了日が設定されている場合はURLを作成してリダイレクト
      if (endDateInput && endDateInput.value) {
        constructAndRedirectURL(startDateInput.value, endDateInput.value);
      }
    }
    // 他のチェックボックスを外す
    document.querySelectorAll('label.input-button-primary.rounded-sm.css-1wifdzn input[type="checkbox"]').forEach(cb => {
      if (cb.id !== 'all_period') cb.checked = false;
    });
    // 自分をON
    e.target.checked = true;
  }

  function insertButtons() {
    const thisYearLabel = findThisYearButton();
    if (!thisYearLabel) return;
    
    // 「今年」ボタンを囲むdiv（class="mr-x-1"）を取得
    const thisYearContainer = thisYearLabel.parentElement;
    if (!thisYearContainer || !thisYearContainer.classList.contains('mr-x-1')) return;
    
    // ボタンコンテナの親（class="flex mb-x-1"）を取得
    const buttonRow = thisYearContainer.parentElement;
    if (!buttonRow || !buttonRow.classList.contains('flex')) return;
    
    // すでに追加済みなら何もしない
    if (buttonRow.querySelector('#one_year') && buttonRow.querySelector('#all_period')) return;
    
    // 「直近1年」ボタンを追加（まだない場合）
    if (!buttonRow.querySelector('#one_year')) {
      const oneYearContainer = document.createElement('div');
      oneYearContainer.className = 'mr-x-1';
      
      const oneYearLabel = createOneYearButton();
      oneYearLabel.querySelector('input').addEventListener('change', onOneYearClick);
      
      oneYearContainer.appendChild(oneYearLabel);
      
      // 「今年」ボタンのコンテナの後に挿入
      thisYearContainer.parentNode.insertBefore(oneYearContainer, thisYearContainer.nextSibling);
    }
    
    // 「全期間」ボタンを追加（まだない場合）
    if (!buttonRow.querySelector('#all_period')) {
      const allPeriodContainer = document.createElement('div');
      allPeriodContainer.className = 'mr-x-1';
      
      const allPeriodLabel = createAllPeriodButton();
      allPeriodLabel.querySelector('input').addEventListener('change', onAllPeriodClick);
      
      allPeriodContainer.appendChild(allPeriodLabel);
      
      // 「直近1年」ボタンの後に挿入（「直近1年」ボタンが既にあればその後、なければ「今年」ボタンの後）
      const oneYearButton = buttonRow.querySelector('#one_year');
      const referenceElement = oneYearButton ? 
        oneYearButton.closest('.mr-x-1').nextSibling : 
        thisYearContainer.nextSibling;
      
      if (referenceElement) {
        buttonRow.insertBefore(allPeriodContainer, referenceElement);
      } else {
        buttonRow.appendChild(allPeriodContainer);
      }
    }
  }

  // ページ描画後に実行
  window.addEventListener('DOMContentLoaded', insertButtons);
  // SPA対策: 動的描画にも対応
  const observer = new MutationObserver(insertButtons);
  observer.observe(document.body, { childList: true, subtree: true });
})();
