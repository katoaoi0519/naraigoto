// -*- coding: utf-8 -*-
// S3 static site → CloudFront(/api/*) → API Gateway → Lambda
(function(){
    'use strict';
  
    // =========================
    // Config & Utilities
    // =========================
    var API_BASE = '/api';
  
    function buildUrl(path, params){
      var p = (path.charAt(0)==='/' ? path : '/' + path);
      var u = new URL(API_BASE + p, location.origin);
      if (params && typeof params === 'object'){
        Object.keys(params).forEach(function(k){
          var v = params[k];
          if (v !== undefined && v !== null && v !== '') u.searchParams.set(k, String(v));
        });
      }
      return u;
    }
  
    async function apiGet(path, params){
      var url = buildUrl(path, params);
      var res = await fetch(url.toString(), { headers: { 'accept': 'application/json' } });
      if(!res.ok){
        var txt = await res.text().catch(function(){ return ''; });
        throw new Error('GET ' + path + ' ' + res.status + (txt ? (' ' + txt) : ''));
      }
      var ct = res.headers.get('content-type') || '';
      return ct.indexOf('application/json') >= 0 ? res.json() : res.text();
    }
  
    async function apiPost(path, body){
      var url = buildUrl(path);
      var res = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'accept':'application/json' },
        body: JSON.stringify(body || {})
      });
      if(!res.ok){
        var txt = await res.text().catch(function(){ return ''; });
        throw new Error('POST ' + path + ' ' + res.status + (txt ? (' ' + txt) : ''));
      }
      var ct = res.headers.get('content-type') || '';
      return ct.indexOf('application/json') >= 0 ? res.json() : res.text();
    }
  
    function setStatus(text, cls){
      var $s = $('#status');
      $s.removeClass('ok err');
      if (cls) $s.addClass(cls);
      $s.text(text);
    }
  
    function escapeHtml(s){
      if (s == null) return '';
      return String(s).replace(/[&<>"']/g, function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]; });
    }
  
    function starify(n){
      var x = Math.max(1, Math.min(5, Number(n)||0));
      return '★★★★★'.slice(0, x);
    }
  
    function getQueryParam(key){
      return new URLSearchParams(location.search).get(key);
    }
  
    function toJpDate(iso){
      if(!iso) return '';
      var d = new Date(iso);
      if (isNaN(d)) return iso;
      try{
        return d.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
      }catch(_){ return d.toISOString(); }
    }
  
    // =========================
    // Lessons List
    // =========================
    async function loadLessons(){
      setStatus('レッスン一覧を取得中…');
      try{
        var data = await apiGet('/lessons');
        var arr = Array.isArray(data) ? data : (data.items || data || []);
        var $sel = $('#lessonSelect').empty();
        var $wrap = $('#lessons').empty();
  
        if(!Array.isArray(arr) || arr.length===0){
          $wrap.append($('<div>').addClass('muted').text('レッスンが見つかりません。'));
          setStatus('レッスンが見つかりませんでした。','err');
          return;
        }
  
        arr.forEach(function(it){
          var id = it.lessonsId || it.lessonId || it.id;
          if(!id) return;
          var title = it.title || (it.courses && it.courses[0] && it.courses[0].title) || '-';
          var area = it.area || it.prefecture || (it.address && it.address.prefecture) || '-';
          var genre = it.genre || it.category || '-';
  
          // セレクト
          $sel.append($('<option>').val(id).text(id + '｜' + title));
  
          // カード
          var $card = $('<div>').addClass('card').attr('data-id', id);
          $card.append($('<div>').addClass('id').text(id));
          $card.append($('<div>').text(title));
          $card.append($('<div>').addClass('pill').text(area + '・' + genre));
          $card.on('click', function(){ selectLesson(id); });
          $wrap.append($card);
        });
  
        setStatus('レッスン一覧を表示しました。','ok');
      }catch(e){
        console.error(e);
        setStatus('一覧取得に失敗しました: ' + (e && e.message ? e.message : e), 'err');
      }
    }
  
    async function selectLesson(id){
      $('#lessonSelect').val(id);
      await loadDetail(id);
      await loadReviews(id);
    }
  
    // =========================
    // Lesson Detail (Lessonsdetail)
    // =========================
    async function loadDetail(id){
      setStatus('詳細取得中… (lessonsId=' + id + ')');
      var $detail = $('#detail').empty().addClass('detail');
  
      try{
        // /lessonsdetail?lessonsId=...
        var d = await apiGet('/lessonsdetail', { lessonsId: id });
  
        var courses = Array.isArray(d && d.courses) ? d.courses : [];
        var firstCourse = courses.length ? courses[0] : {};
        var title = (firstCourse && firstCourse.title) || d.title || d.lessonsId || id;
        var pref  = d.prefecture || (d.address && d.address.prefecture) || '';
        var city  = (d.address && d.address.city) || '';
        var updated = d.updatedAt ? toJpDate(d.updatedAt) : '';
  
        // courses html
        var list = '';
        for (var i=0; i<courses.length; i++){
          var c = courses[i] || {};
          var dur = (typeof c.durationMin === 'number') ? (c.durationMin + '分') : (c.durationMin || '-');
          list += ''
            + '<li class="course">'
            +   '<div class="course-title">' + escapeHtml(c.title || '-') + '</div>'
            +   '<div class="course-meta muted">' + escapeHtml(c.level || '-') + '・' + escapeHtml(c.ageRange || '-') + '・' + escapeHtml(dur) + '</div>'
            +   (c.summary ? '<div class="course-summary">' + escapeHtml(c.summary) + '</div>' : '')
            +   (c.price   ? '<div class="course-price">'   + escapeHtml(c.price)   + '</div>' : '')
            + '</li>';
        }
        var coursesHtml = list ? ('<ul class="course-list">' + list + '</ul>') : '<div class="muted">コース情報はありません</div>';
  
        var html = ''
          + '<div class="detail-head">'
          +   (d.iconUrl ? '<img class="detail-icon" src="' + escapeHtml(d.iconUrl) + '" alt="' + escapeHtml(title) + '">' : '')
          +   '<div class="detail-head-right">'
          +     '<div class="detail-title">' + escapeHtml(title) + '</div>'
          +     '<div class="detail-chips">'
          +       (pref ? '<span class="chip">' + escapeHtml(pref) + '</span>' : '')
          +       (city ? '<span class="chip">' + escapeHtml(city) + '</span>' : '')
          +     '</div>'
          +     (updated ? '<div class="muted">最終更新: ' + escapeHtml(updated) + '</div>' : '')
          +   '</div>'
          + '</div>'
  
          + '<div class="detail-kv"><div class="kv-k">概要</div><div class="kv-v">' + escapeHtml(d.description || '-') + '</div></div>'
          + '<div class="detail-kv"><div class="kv-k">コース</div><div class="kv-v">' + coursesHtml + '</div></div>'
  
          + '<div class="detail-actions">'
          +   '<button class="btn primary" id="ctaBook">予約する</button>'
          +   '<button class="btn ghost" id="ctaShare">共有リンクをコピー</button>'
          + '</div>';
  
        $detail.html(html);
  
        // Share
        $('#ctaShare').on('click', function(){
          var link = location.origin + '/?lessonsId=' + encodeURIComponent(d.lessonsId || id);
          if (navigator.clipboard && navigator.clipboard.writeText){
            navigator.clipboard.writeText(link)
              .then(function(){ setStatus('リンクをコピーしました。','ok'); })
              .catch(function(){ setStatus('リンクのコピーに失敗しました。','err'); });
          }else{
            window.prompt('このリンクをコピーしてください', link);
          }
        });
  
        // Booking (demo)
        $('#ctaBook').on('click', function(){
          var userId = ($('#uid').val()||'').trim() || 'demo-user';
          var time = new Date(Date.now()+60*60*1000).toISOString();
          apiPost('/bookings', { lessonId: (d.lessonsId || id), userId: userId, time: time })
            .then(function(){ setStatus('仮予約を作成しました。','ok'); })
            .catch(function(e){ console.error(e); setStatus('予約に失敗しました。','err'); });
        });
  
        setStatus('詳細を表示しました。','ok');
      }catch(e){
        console.error('loadDetail error:', e);
        $detail.text('取得に失敗しました。');
        setStatus('詳細の取得に失敗しました。','err');
      }
    }
  
    // =========================
    // Reviews
    // =========================
    async function loadReviews(lessonId){
      setStatus('口コミ取得中… (lessonsId=' + lessonId + ')');
      var $wrap = $('#reviews').empty();
      try{
        var data = await apiGet('/reviews', { lessonsId: lessonId });
        var parents = (data && data.parents) || [];
        var children = (data && data.children) || [];
        var rows = [];
  
        parents.forEach(function(r){ rows.push({ who:'保護者', rating:r.rating, comment:r.comment, userId:r.userId }); });
        children.forEach(function(r){ rows.push({ who:'子ども', rating:r.rating, comment:r.comment, userId:r.userId }); });
  
        if(rows.length===0){
          $wrap.append($('<div>').addClass('muted').text('まだ口コミがありません。'));
          setStatus('口コミはまだありません。','ok');
          return;
        }
  
        rows.forEach(function(r){
          var $r = $('<div>').addClass('rev');
          $r.append($('<div>').addClass('stars').text(starify(r.rating)));
          $r.append($('<div>').text(r.comment || ''));
          $r.append($('<div>').addClass('muted').text(r.who + '（' + (r.userId || 'anonymous') + '）'));
          $wrap.append($r);
        });
  
        setStatus('口コミを表示しました。','ok');
      }catch(e){
        console.error(e);
        setStatus('口コミ取得に失敗しました: ' + (e && e.message ? e.message : e), 'err');
        $wrap.append($('<div>').addClass('muted').text('口コミの取得に失敗しました。'));
      }
    }
  
    async function postReview(){
      var lessonId = $('#lessonSelect').val();
      var userId = ($('#uid').val()||'').trim() || 'demo-user';
      var rating = Number($('#rating').val()||5);
      var comment = ($('#comment').val()||'').trim() || 'とても良かった！';
      var role = 'parent'; // 簡易UIのため固定
  
      setStatus('レビューを送信中…');
      try{
        await apiPost('/reviews', { lessonsId: lessonId, userId: userId, rating: rating, comment: comment, role: role });
        setStatus('レビューを投稿しました。','ok');
        await loadReviews(lessonId);
      }catch(e){
        console.error(e);
        setStatus('レビュー投稿に失敗しました: ' + (e && e.message ? e.message : e), 'err');
      }
    }
  
    // =========================
    // Bindings / Init
    // =========================
    $(function(){
      // 初期ロード：一覧 → 初期選択（URL ?lessonsId= / ?lessonId= を優先）
      loadLessons().then(function(){
        var q1 = getQueryParam('lessonsId');
        var q2 = getQueryParam('lessonId');
        var first = q1 || q2 || $('#lessonSelect').val();
        if (first) selectLesson(first);
      });
  
      $('#btnRefreshLessons').on('click', function(){ loadLessons(); });
      $('#btnFetchDetail').on('click', function(){
        var id = $('#lessonSelect').val();
        if(id) loadDetail(id);
      });
      $('#btnFetchReviews').on('click', function(){
        var id = $('#lessonSelect').val();
        if(id) loadReviews(id);
      });
      $('#btnPostReview').on('click', postReview);
  
      // セレクト変更時に反映
      $('#lessonSelect').on('change', function(){
        var id = $(this).val();
        if(id) selectLesson(id);
      });
    });
  
  })();
  
