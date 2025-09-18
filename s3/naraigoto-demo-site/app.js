// -*- coding: utf-8 -*-
// Simple demo app script for S3 static site → CloudFront(/api/*) → API Gateway

(function(){
    'use strict';

    const API_BASE = '/api';

    function buildUrl(path, params){
        const u = new URL((API_BASE + path), location.origin);
        if (params && typeof params === 'object'){
            Object.entries(params).forEach(([k,v])=>{
                if (v !== undefined && v !== null && v !== '') u.searchParams.set(k, String(v));
            });
        }
        return u;
    }

    async function apiGet(path, params){
        const url = buildUrl(path, params);
        const res = await fetch(url.toString(), { headers: { 'accept': 'application/json' } });
        if(!res.ok) throw new Error('GET ' + path + ' ' + res.status);
        const ct = res.headers.get('content-type') || '';
        return ct.includes('application/json') ? res.json() : res.text();
    }

    async function apiPost(path, body){
        const url = buildUrl(path);
        const res = await fetch(url.toString(), {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'accept':'application/json' },
            body: JSON.stringify(body)
        });
        if(!res.ok) throw new Error('POST ' + path + ' ' + res.status);
        return res.json();
    }

    function setStatus(text, cls){
        const $s = $('#status');
        $s.removeClass('ok err');
        if (cls) $s.addClass(cls);
        $s.text(text);
    }

    function escapeHtml(s){
        return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
    }

    function starify(n){
        const x = Math.max(1, Math.min(5, Number(n)||0));
        return '★★★★★'.slice(0, x);
    }

    function getQueryParam(key){
        return new URLSearchParams(location.search).get(key);
    }

    async function loadLessons(){
        setStatus('レッスン一覧を取得中…');
        const data = await apiGet('/lessons');
        const arr = Array.isArray(data) ? data : (data.items || data || []);
        const $sel = $('#lessonSelect').empty();
        const $wrap = $('#lessons').empty();
        arr.forEach(it => {
            const id = it.lessonId || it.lessonsId || it.id;
            if(!id) return;
            const title = it.title || '-';
            const area = it.area || '-';
            const genre = it.genre || it.category || '-';
            $sel.append($('<option>').val(id).text(`${id}｜${title}`));
            const $card = $('<div>').addClass('card').attr('data-id', id);
            $card.append($('<div>').addClass('id').text(id));
            $card.append($('<div>').text(title));
            $card.append($('<div>').addClass('pill').text(area + '・' + genre));
            $card.on('click', ()=> selectLesson(id));
            $wrap.append($card);
        });
        setStatus('レッスン一覧を表示しました。', 'ok');
    }

    async function selectLesson(id){
        $('#lessonSelect').val(id);
        await loadDetail(id);
        await loadReviews(id);
    }

    async function loadDetail(id){
        setStatus(`詳細取得中… (lessonId=${id})`);
        try{
            const data = await apiGet('/lessons/' + encodeURIComponent(id));
            const $detail = $('#detail').empty().addClass('detail');
            const html = `
                <div class="detail-head">
                    <div class="detail-title">${escapeHtml(data.title||'—')}</div>
                    <div class="detail-chips">
                        <span class="chip">${escapeHtml(data.area||'—')}</span>
                        <span class="chip">${escapeHtml(data.genre||'—')}</span>
                    </div>
                </div>
                <div class="detail-kv">
                    <div class="kv-k">概要</div><div class="kv-v">${escapeHtml(data.title||'—')}（${escapeHtml(data.genre||'—')}）</div>
                    <div class="kv-k">場所</div><div class="kv-v">${escapeHtml(data.area||'—')}</div>
                    <div class="kv-k">開講状況</div><div class="kv-v">受付中</div>
                </div>
                <div class="detail-actions">
                    <button class="btn primary" id="ctaBook">予約する</button>
                    <button class="btn ghost" id="ctaShare">共有リンクをコピー</button>
                </div>
            `;
            $detail.html(html);
            $('#ctaShare').on('click', async ()=>{
                const link = location.origin + '/?lessonId=' + encodeURIComponent(data.lessonId || id);
                try{ await navigator.clipboard.writeText(link); setStatus('リンクをコピーしました。','ok'); }
                catch{ setStatus('リンクのコピーに失敗しました。','err'); }
            });
            $('#ctaBook').on('click', async ()=>{
                try{
                    const userId = ($('#uid').val()||'').trim() || 'demo-user';
                    const time = new Date(Date.now()+60*60*1000).toISOString();
                    await apiPost('/bookings', { lessonId: (data.lessonId || id), userId, time });
                    setStatus('仮予約を作成しました。','ok');
                }catch(e){ setStatus('予約に失敗しました。','err'); console.error(e); }
            });
            setStatus('詳細を表示しました。','ok');
        }catch(e){
            $('#detail').text('取得に失敗しました。');
            setStatus('詳細の取得に失敗しました。','err'); console.error(e);
        }
    }

    async function loadReviews(lessonId){
        setStatus(`口コミ取得中… (lessonId=${lessonId})`);
        try{
            // 現行Lambdaは lessonsId を受け取る
            const data = await apiGet('/reviews', { lessonsId: lessonId });
            const parents = (data && data.parents) || [];
            const children = (data && data.children) || [];
            const rows = [];
            parents.forEach(r => rows.push({ who:'保護者', rating:r.rating, comment:r.comment, userId:r.userId }));
            children.forEach(r => rows.push({ who:'子ども', rating:r.rating, comment:r.comment, userId:r.userId }));

            const $wrap = $('#reviews').empty();
            if(rows.length===0){
                $wrap.append($('<div>').addClass('muted').text('まだ口コミがありません。'));
            }
            rows.forEach(r => {
                const $r = $('<div>').addClass('rev');
                $r.append($('<div>').addClass('stars').text(starify(r.rating)));
                $r.append($('<div>').text(r.comment || ''));
                $r.append($('<div>').addClass('muted').text(`${r.who}（${r.userId || 'anonymous'}）`));
                $wrap.append($r);
            });
            setStatus('口コミを表示しました。','ok');
        }catch(e){ setStatus('口コミ取得に失敗しました。','err'); console.error(e); }
    }

    async function postReview(){
        const lessonId = $('#lessonSelect').val();
        const userId = ($('#uid').val()||'').trim() || 'demo-user';
        const rating = Number($('#rating').val()||5);
        const comment = ($('#comment').val()||'').trim() || 'とても良かった！';
        const role = 'parent'; // UI簡易化のため固定。必要ならセレクトを追加
        setStatus('レビューを送信中…');
        try{
            await apiPost('/reviews', { lessonsId: lessonId, userId, rating, comment, role });
            setStatus('レビューを投稿しました。','ok');
            await loadReviews(lessonId);
        }catch(e){ setStatus('レビュー投稿に失敗しました。','err'); console.error(e); }
    }

    // ===== Bindings =====
    $(function(){
        loadLessons().then(()=>{
            const q = getQueryParam('lessonId');
            const first = q || $('#lessonSelect').val();
            if(first) selectLesson(first);
        });
        $('#btnRefreshLessons').on('click', ()=> loadLessons());
        $('#btnFetchDetail').on('click', ()=> { const id=$('#lessonSelect').val(); if(id) loadDetail(id); });
        $('#btnFetchReviews').on('click', ()=> { const id=$('#lessonSelect').val(); if(id) loadReviews(id); });
        $('#btnPostReview').on('click', postReview);
    });
})();