package main.project.server.chart.repository;

import main.project.server.chart.condition.SearchCondition;
import main.project.server.chart.dto.AgeChartDto;
import main.project.server.chart.dto.MonthlyReservationChartDto;
import main.project.server.member.entity.Member;
import main.project.server.roomreservation.entity.RoomReservation;

import java.util.List;

public interface CustomizedRoomReservationRepository {
    List<MonthlyReservationChartDto.MonthlyReservation> findByYearGroupByMonth(Long guestHouseId, int year);

    List<AgeChartDto.AgeGroupReservation> findGroupByAge(Long guestHouseId, SearchCondition condition);

    List<RoomReservation> findMyReservationByGuestHouse(Member member, SearchCondition condition);
}
